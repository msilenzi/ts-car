// import GamepadController from 'GamepadController/GamepadController'
// import {
//   XboxAxesMapper,
//   XboxButtonMapper,
//   xboxAxesMapper,
//   xboxButtonMapper,
// } from 'mappers/xboxMapper'

// function handleStatusUpdated(status: {
//   buttons: Partial<XboxButtonMapper>
//   axes: Partial<XboxAxesMapper>
// }) {
//   console.log(status.buttons)
//   console.log('LEFT_THUMBSTICK', status.axes.LEFT_THUMBSTICK ?? null)
//   console.log('RIGHT_THUMBSTICK', status.axes.RIGHT_THUMBSTICK ?? null)
//   console.log('\n\n')
// }

// let xboxController: GamepadController<XboxButtonMapper, XboxAxesMapper>

// window.addEventListener('gamepadconnected', ({ gamepad }) => {
//   xboxController = new GamepadController(
//     gamepad.index,
//     xboxButtonMapper,
//     xboxAxesMapper,
//     handleStatusUpdated
//   )
//   xboxController.start()
// })

//
//
//

import GamepadController from 'GamepadController/GamepadController'
import {
  WheelAxesMapper,
  WheelButtonMapper,
  wheelAxesMapper,
  wheelButtonMapper,
} from 'mappers/wheelMapper'

let wheelController: GamepadController<WheelButtonMapper, WheelAxesMapper>

function handleStatusUpdated(status: {
  buttons: Partial<WheelButtonMapper>
  axes: Partial<WheelAxesMapper>
}) {
  console.log(status.buttons)
  console.log(status.axes.direccion)
}

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  wheelController = new GamepadController(
    gamepad.index,
    wheelButtonMapper,
    wheelAxesMapper,
    handleStatusUpdated
  )

  wheelController.start()
})
