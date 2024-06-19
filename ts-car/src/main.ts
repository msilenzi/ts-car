import BasicCarController from 'CarController/BasicCarController'
import { xboxCarMapper } from 'CarController/mappers'

let carController: BasicCarController | null

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  carController = new BasicCarController(gamepad.index, xboxCarMapper)
  carController.start()
})

window.addEventListener('gamepaddisconnected', () => {
  carController?.stop()
  carController = null
})
