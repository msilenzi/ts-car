import { DriverOption, TypeOption } from '../main.ts'
import { setStatus } from './status.ts'

export type FormData = {
  ipAddress: string
  controllerIndex: number
  typeIndex: number
  driverIndex: number
}

const $form: HTMLFormElement = document.querySelector('#formConnect')!
const $inputIpAddr: HTMLInputElement = document.querySelector('#ipAddress')!
const $selectController: HTMLSelectElement =
  document.querySelector('#controller')!
const $selectType: HTMLSelectElement = document.querySelector('#type')!
const $selectDriver: HTMLSelectElement = document.querySelector('#driver')!

const $btnConnect: HTMLButtonElement = document.querySelector('#connectBtn')!

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

function loadTypeOptions(types: TypeOption[]) {
  $selectType.innerHTML = ''
  types.forEach((type, index) => {
    const $option = document.createElement('option')
    $option.value = index.toString()
    $option.innerText = type.displayName
    $selectType.appendChild($option)
  })
}

function loadDriversOptions(drivers: DriverOption[]) {
  $selectDriver.innerHTML = ''
  drivers.forEach((driver, index) => {
    const $option = document.createElement('option')
    $option.value = index.toString()
    $option.innerText = driver.displayName
    $selectDriver.appendChild($option)
  })
}

function bindOnFinish(handler: (values: FormData) => void) {
  $form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Validar formulario
    const formValidiy = $form.checkValidity()
    $form.classList.add('was-validated')

    // Si algún input es inválido terminar
    if (!formValidiy) {
      e.stopPropagation()
      return
    }

    setStatus('warning', 'conectando...')

    if (!(await _isValidIpAddress())) {
      e.stopPropagation()
      setStatus('danger', 'no se puedo conectar a la IP ingresada')
      return
    }

    setStatus('success', 'conectado')
    handler(_getFormValues())
  })
}

function _getFormValues(): FormData {
  return {
    ipAddress: $inputIpAddr.value,
    controllerIndex: parseInt($selectController.value),
    typeIndex: parseInt($selectType.value),
    driverIndex: parseInt($selectDriver.value),
  }
}

async function _isValidIpAddress(): Promise<boolean> {
  // Si la URL termina con una / se elimina
  if ($inputIpAddr.value.endsWith('/')) {
    $inputIpAddr.value = $inputIpAddr.value.slice(0, -1)
  }

  // Envía un fetch /parar a la URL ingresada. Si en 1 segundo no responde
  // cancela la petición y devuelve false:

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 1000)

  try {
    const resp = await fetch(`${$inputIpAddr.value}/parar`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return resp.ok
  } catch (error) {
    return false
  }
}

export default {
  loadControllerOptions,
  loadTypeOptions,
  loadDriversOptions,
  bindOnFinish,
}
