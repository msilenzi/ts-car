import BasicCarController from 'CarController/BasicCarController'
import { xboxCarMapper } from 'CarController/mappers'

const CAR_URL = 'http://192.168.1.38:1880'

let carController: BasicCarController | null

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  carController = new BasicCarController(gamepad.index, xboxCarMapper, CAR_URL)
  carController.start()
})

window.addEventListener('gamepaddisconnected', () => {
  carController?.stop()
  carController = null
})
