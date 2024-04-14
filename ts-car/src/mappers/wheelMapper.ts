import GamepadAxes from 'GamepadController/GamepadAxes'
import GamepadButtons from 'GamepadController/GamepadButtons'
import GamepadController, {
  StatusUpdatedHandler,
} from 'GamepadController/GamepadController'

const wheelButtonMapper = {
  adelante: 5,
  atras: 4,
}

const wheelAxesMapper = {
  direccion: { x: 0 },
}

type WheelButtonMapper = typeof wheelButtonMapper
type WheelAxesMapper = typeof wheelAxesMapper

export type WheelGamepad = GamepadController<WheelButtonMapper, WheelAxesMapper>

export function createWheelGamepad(
  gamepadIndex: number,
  handleStatusUpdated: StatusUpdatedHandler<WheelButtonMapper, WheelAxesMapper>
): WheelGamepad {
  return new GamepadController(
    gamepadIndex,
    new GamepadButtons(wheelButtonMapper),
    new GamepadAxes(wheelAxesMapper),
    handleStatusUpdated
  )
}
