import AbstractGamepadController from 'GamepadController/AbstractGamepadController.ts'
import AbstractGamepadInput from '../GamepadController/GamepadInput/AbstractGamepadInput.ts'

/**
 * Este tipo unifica todos los botones que puede tener un control.
 *
 * Los botones pueden variar según el tipo de control, pero es necesario que
 * estén todos unidos en este tipo para poder elegir el control dinámicamente.
 */
export type CarMapper = {
  adelante: AbstractGamepadInput<number>
  atras: AbstractGamepadInput<number>
  izquierda?: AbstractGamepadInput<number>
  derecha?: AbstractGamepadInput<number>
  rotarIzq?: AbstractGamepadInput<number>
  rotarDer?: AbstractGamepadInput<number>
  direccion?: AbstractGamepadInput<number>
}

/**
 * Esta clase sirve para unificar los mappers que deben tener los controladores
 * del auto.
 */
export default abstract class AbstractCarController extends AbstractGamepadController<CarMapper> {
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
