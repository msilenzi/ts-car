import CarController from 'CarController/CarController'
import XboxCarController from 'CarController/XboxCarController'

let carController: CarController | null

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  carController = new XboxCarController(gamepad.index)
  carController.start()
})

window.addEventListener('gamepaddisconnected', () => {
  carController?.stop()
  carController = null
})
