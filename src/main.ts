import GamepadController from 'GamepadController/GamepadController'

const xboxButtonMapper = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  BUMPER_LEFT: 4,
  BUMPER_RIGHT: 5,
  TRIGGER_LEFT: 6,
  TRIGGER_RIGHT: 7,
  BUTTON_VIEW: 8,
  BUTTON_MENU: 9,
  THUMBSTICK_L_CLICK: 10,
  THUMBSTICK_R_CLICK: 11,
  D_PAD_UP: 12,
  D_PAD_DOWN: 13,
  D_PAD_LEFT: 14,
  D_PAD_RIGHT: 15,
  BUTTON_HOME: 16,
}

const xboxAxesMapper = {
  LEFT_THUMBSTICK: { x: 0, y: 1 },
  RIGHT_THUMBSTICK: { x: 2, y: 3 },
}

type XboxButtonMapper = typeof xboxButtonMapper
type XboxAxesMapper = typeof xboxAxesMapper

function handleStatusUpdated(status: {
  buttons: Partial<XboxButtonMapper>
  axes: Partial<XboxAxesMapper>
}) {
  console.log(status.buttons)
  console.log(status.axes.LEFT_THUMBSTICK?.x, status.axes.LEFT_THUMBSTICK?.y)
}

let xboxController: GamepadController<XboxButtonMapper, XboxAxesMapper>

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  xboxController = new GamepadController(
    gamepad.index,
    xboxButtonMapper,
    xboxAxesMapper,
    handleStatusUpdated
  )
  xboxController.start()
})
