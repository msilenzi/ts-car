import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import AbstractCarController, {
  CarMapper,
} from 'CarController/AbstractCarController'
import AdvancedCarController from 'CarController/AdvancedCarController'
import BasicCarController from 'CarController/BasicCarController'

import { wheelCarMapper, xboxCarMapper } from 'CarController/mappers'
import form from './ui/form.ts'

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
    mapper: xboxCarMapper,
  },
  {
    displayName: 'Volante',
    mapper: wheelCarMapper,
  },
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

const $status: HTMLSpanElement = document.querySelector('#connectionStatus')!

let carController: AbstractCarController | null = null

window.addEventListener('DOMContentLoaded', () => {
  form.loadControllerOptions()
  form.loadTypeOptions(TYPES)
  form.loadDriversOptions(DRIVERS)

  $status.innerText = 'desconectado'
  $status.className = 'text-danger'
})

form.bindOnFinish(({ ipAddress, controllerIndex, typeIndex, driverIndex }) => {
  carController = new DRIVERS[driverIndex].Driver(
    controllerIndex,
    TYPES[typeIndex].mapper,
    ipAddress
  )
  carController.start()
})

window.addEventListener('gamepadconnected', () => {
  form.loadControllerOptions()
})

window.addEventListener('gamepaddisconnected', () => {
  form.loadControllerOptions()
  carController?.stop()
  carController = null
})

/*
  [x] Hacer que se conecte con la configuración establecida
        [x] Configurar node-red para trabajar con los dos drivers
  [ ] Actualizar estado
  [~] Validar formulario
  [ ] Latencia
  [ ] Guardar configuración en localStorage
  [ ] Documentar
  [x] Instalar bootstrap en el proyecto y eliminar CDN
*/
