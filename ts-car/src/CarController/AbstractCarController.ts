import GamepadAxes from 'GamepadController/GamepadAxes'
import GamepadButtons from 'GamepadController/GamepadButtons'
import GamepadController from 'GamepadController/GamepadController'

export type CarButtonMapper = { adelante: number; atras: number }
export type CarAxesMapper = { direccion: { x: number } }

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
  protected readonly CAR_URL: string

  protected constructor(gamepadIndex: number, carMapper: CarMapper, CAR_URL: string) {
    super(
      gamepadIndex,
      new GamepadButtons(carMapper.buttons),
      new GamepadAxes(carMapper.axes)
    )
    this.CAR_URL = CAR_URL
  }
}
