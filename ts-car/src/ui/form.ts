import { DriverOption, TypeOption } from '../main.ts'
import { setStatus } from './connectionStatus.ts'

export type FormData = {
  ipAddress: string
  controllerIndex: number
  typeIndex: number
  driverIndex: number
}

let lastSubmitted: FormData = {
  ipAddress: '',
  controllerIndex: NaN,
  typeIndex: 0,
  driverIndex: 0,
}

const $form: HTMLFormElement = document.querySelector('#formConnect')!
const $inputIpAddr: HTMLInputElement = document.querySelector('#ipAddress')!
const $selectController: HTMLSelectElement =
  document.querySelector('#controller')!
const $selectType: HTMLSelectElement = document.querySelector('#type')!
const $selectDriver: HTMLSelectElement = document.querySelector('#driver')!

const $btnConnect: HTMLButtonElement = document.querySelector('#connectBtn')!

export function loadControllerOptions() {
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

export function loadTypeOptions(types: TypeOption[]) {
  $selectType.innerHTML = ''
  types.forEach((type, index) => {
    const $option = document.createElement('option')
    $option.value = index.toString()
    $option.innerText = type.displayName
    $selectType.appendChild($option)
  })
}

export function loadDriversOptions(drivers: DriverOption[]) {
  $selectDriver.innerHTML = ''
  drivers.forEach((driver, index) => {
    const $option = document.createElement('option')
    $option.value = index.toString()
    $option.innerText = driver.displayName
    $selectDriver.appendChild($option)
  })
}

export function initForm(types: TypeOption[], drivers: DriverOption[]) {
  loadControllerOptions()
  loadTypeOptions(types)
  loadDriversOptions(drivers)
  $btnConnect.disabled = true
  setStatus('secondary', 'desconectado')
}

export function bindOnFinish(handler: (values: FormData) => void) {
  $form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Validar formulario
    const formValidity = $form.checkValidity()
    $form.classList.add('was-validated')

    // Si algún input es inválido terminar
    if (!formValidity) {
      e.stopPropagation()
      return
    }

    setStatus('warning', 'conectando...')

    if (!(await _isValidIpAddress())) {
      e.stopPropagation()
      setStatus('danger', 'no se puedo conectar a la IP ingresada')
      return
    }

    $btnConnect.disabled = true
    setStatus('success', 'conectado')
    lastSubmitted = _getCurrentFormValues()
    handler(lastSubmitted)
  })

  $form.addEventListener('input', () => {
    $btnConnect.disabled =
      JSON.stringify(_getCurrentFormValues()) === JSON.stringify(lastSubmitted)
  })
}

export function enableSubmit() {
  $btnConnect.disabled = false
}

function _getCurrentFormValues(): FormData {
  return {
    ipAddress: $inputIpAddr.value,
    controllerIndex: parseInt($selectController.value),
    typeIndex: parseInt($selectType.value),
    driverIndex: parseInt($selectDriver.value),
  }
}

async function _isValidIpAddress(): Promise<boolean> {
  $inputIpAddr.value = $inputIpAddr.value.trim()

  // Si la URL termina con una / se elimina
  if ($inputIpAddr.value.endsWith('/')) {
    $inputIpAddr.value = $inputIpAddr.value.slice(0, -1)
  }

  // Envía un GET /parar a la URL ingresada. Si en 1 segundo no responde
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
