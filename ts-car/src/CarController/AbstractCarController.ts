import GamepadController from 'GamepadController/GamepadController'
import AbstractGamepadInput from '../GamepadController/GamepadInput/AbstractGamepadInput.ts'

export type CarMapper = {
  adelante: AbstractGamepadInput<number>
  atras: AbstractGamepadInput<number>
  rotarIzq?: AbstractGamepadInput<number>
  rotarDer?: AbstractGamepadInput<number>
  direccion: AbstractGamepadInput<number>
}

export default abstract class AbstractCarController extends GamepadController<CarMapper> {
  protected readonly CAR_URL: string

  protected constructor(
    gamepadIndex: number,
    mapper: CarMapper,
    CAR_URL: string
  ) {
    super(gamepadIndex, mapper)
    this.CAR_URL = CAR_URL
  }
}
