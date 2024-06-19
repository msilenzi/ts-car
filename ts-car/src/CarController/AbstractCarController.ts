import GamepadAxes from 'GamepadController/GamepadAxes'
import GamepadButtons from 'GamepadController/GamepadButtons'
import GamepadController from 'GamepadController/GamepadController'

type CarButtonMapper = { adelante: number; atras: number }
type CarAxesMapper = { direccion: { x: number } }

export type CarMapper = { buttons: CarButtonMapper; axes: CarAxesMapper }

export type Instructions =
  | 'adelante'
  | 'atras'
  | 'parar'
  | 'derecha'
  | 'izquierda'

export default abstract class AbstractCarController extends GamepadController<
  CarButtonMapper,
  CarAxesMapper
> {
  constructor(gamepadIndex: number, carMapper: CarMapper) {
    super(
      gamepadIndex,
      new GamepadButtons(carMapper.buttons),
      new GamepadAxes(carMapper.axes)
    )
  }

  public abstract handleStatusUpdated(): void
}
