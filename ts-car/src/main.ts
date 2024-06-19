import AbstractCarController from 'CarController/AbstractCarController'
import AdvancedCarController from 'CarController/AdvancedCarController'
// import BasicCarController from 'CarController/BasicCarController'

import { xboxCarMapper } from 'CarController/mappers'

const CAR_URL = 'http://192.168.1.38:1880'

let carController: AbstractCarController | null

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  // carController = new BasicCarController(gamepad.index, xboxCarMapper, CAR_URL)
  carController = new AdvancedCarController(
    gamepad.index,
    xboxCarMapper,
    CAR_URL
  )
  carController.start()
})

window.addEventListener('gamepaddisconnected', () => {
  carController?.stop()
  carController = null
})
