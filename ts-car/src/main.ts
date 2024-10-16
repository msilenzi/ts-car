import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import * as form from './ui/form.ts'
import * as connectionStatus from './ui/connectionStatus.ts'
import * as controllerStatus from './ui/controllerStatus.ts'
import * as latency from './ui/latency.ts'

import AbstractCarController, {
  CarMapper,
} from 'CarController/AbstractCarController'
import AdvancedCarController from 'CarController/AdvancedCarController'
import BasicCarController from 'CarController/BasicCarController'
import {
  createDancePadMapper,
  createWheelCarMapper,
  createXboxCarMapper,
} from 'CarController/mappers'

export type TypeOption = {
  displayName: string
  mapper: CarMapper
}

export type DriverOption = {
  displayName: string
  Driver: new (
    gamepadIndex: number,
    carMapper: CarMapper,
    CAR_URL: string
  ) => AbstractCarController
}

const TYPES: TypeOption[] = [
  {
    displayName: 'Mando de Xbox',
    mapper: createXboxCarMapper(),
  },
  {
    displayName: 'Volante',
    mapper: createWheelCarMapper(),
  },
  {
    displayName: 'Alfombra de baile',
    mapper: createDancePadMapper(),
  }
]

const DRIVERS: DriverOption[] = [
  {
    displayName: 'Controlador básico',
    Driver: BasicCarController,
  },
  {
    displayName: 'Controlador avanzado',
    Driver: AdvancedCarController,
  },
]

let carController: AbstractCarController | null = null

form.initForm(TYPES, DRIVERS)

form.bindOnFinish(({ ipAddress, controllerIndex, typeIndex, driverIndex }) => {
  carController?.stop()

  carController = new DRIVERS[driverIndex].Driver(
    controllerIndex,
    TYPES[typeIndex].mapper,
    ipAddress
  )

  carController.start()
  latency.setEmptyLatency()
})

window.addEventListener('gamepadconnected', () => {
  form.loadControllerOptions()
})

window.addEventListener('gamepaddisconnected', () => {
  form.loadControllerOptions()
  carController?.stop()
  carController = null
  form.enableSubmit()

  connectionStatus.setConnectionStatus('secondary', 'desconectado')
  latency.setEmptyLatency()
  controllerStatus.setEmptyControllerStatus()
})

// Se dispara cuando se cierra/recarga la página
window.addEventListener('beforeunload', () => {
  carController?.stop()
})

/*
  [x] Hacer que se conecte con la configuración establecida
        [x] Configurar node-red para trabajar con los dos drivers
  [x] Actualizar estado
  [x] Validar formulario
  [x] Latencia
  [ ] Guardar configuración en localStorage
  [ ] Documentar
  [x] Instalar bootstrap en el proyecto y eliminar CDN
*/
