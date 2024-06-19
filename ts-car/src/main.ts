import BasicCarController from 'BasicCarController/BasicCarController'
import XboxCarController from 'BasicCarController/XboxBasicCarController'

let carController: BasicCarController | null

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  carController = new XboxCarController(gamepad.index)
  carController.start()
})

window.addEventListener('gamepaddisconnected', () => {
  carController?.stop()
  carController = null
})

