import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import AbstractCarController from 'CarController/AbstractCarController'
import AdvancedCarController from 'CarController/AdvancedCarController'
import BasicCarController from 'CarController/BasicCarController'

import { wheelCarMapper, xboxCarMapper } from 'CarController/mappers'

const TYPES = [
  {
    displayName: 'Mando de Xbox',
    mapper: xboxCarMapper,
  },
  {
    displayName: 'Volante',
    mapper: wheelCarMapper,
  },
]

const DRIVERS = [
  {
    displayName: 'Controlador básico',
    driver: BasicCarController,
  },
  {
    displayName: 'Controlador avanzado',
    driver: AdvancedCarController,
  },
]

const $form = document.querySelector<HTMLFormElement>('form')!
const $inputIpAddr = document.querySelector<HTMLInputElement>('#ipAddress')!
const $selectController =
  document.querySelector<HTMLSelectElement>('#controller')!
const $selectType = document.querySelector<HTMLSelectElement>('#type')!
const $selectDriver = document.querySelector<HTMLSelectElement>('#driver')!

const $status = document.querySelector<HTMLSpanElement>('#connectionStatus')!

let carController: AbstractCarController | null = null

function loadControllerOptions() {
  const gamepads = navigator.getGamepads()

  $selectController.innerHTML = ''

  if (gamepads.every((gamepad) => gamepad === null)) {
    const $option = document.createElement('option')
    $option.disabled = true
    $option.value = ''
    $option.innerText = 'No hay mandos disponibles'
    $option.selected = true
    $selectController.appendChild($option)
  } else {
    gamepads.forEach((g) => {
      if (g === null) return
      const $option = document.createElement('option')
      $option.value = g.index.toString()
      $option.innerText = g.id
      $selectController.appendChild($option)
    })
  }
}

function loadTypeOptions() {
  $selectType.innerHTML = ''
  TYPES.forEach((type, index) => {
    const $option = document.createElement('option')
    $option.value = index.toString()
    $option.innerText = type.displayName
    $selectType.appendChild($option)
  })
}

function loadDriversOptions() {
  $selectDriver.innerHTML = ''
  DRIVERS.forEach((driver, index) => {
    const $option = document.createElement('option')
    $option.value = index.toString()
    $option.innerText = driver.displayName
    $selectDriver.appendChild($option)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  loadControllerOptions()
  loadTypeOptions()
  loadDriversOptions()

  $status.innerText = 'desconectado'
  $status.className = 'text-danger'
})

$form.addEventListener('submit', (e) => {
  e.preventDefault()

  if (carController !== null) carController.stop()

  const ipAddr = $inputIpAddr.value
  const controller = parseInt($selectController.value, 10)
  const type = parseInt($selectType.value, 10)
  const driver = parseInt($selectDriver.value, 10)

  carController = new DRIVERS[driver].driver(
    controller,
    TYPES[type].mapper,
    ipAddr
  )

  carController.start()
})

window.addEventListener('gamepadconnected', () => {
  loadControllerOptions()
})

window.addEventListener('gamepaddisconnected', () => {
  loadControllerOptions()
  carController?.stop()
  carController = null
})

/*
  [x] Hacer que se conecte con la configuración establecida
        [x] Configurar node-red para trabajar con los dos drivers
  [ ] Actualizar estado
  [ ] Validar formulario
  [ ] Latencia
  [ ] Guardar configuración en localStorage
  [ ] Documentar
  [ ] Instalar bootstrap en el proyecto y eliminar CDN
*/
