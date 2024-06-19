import BasicCarController, { CarMapper } from './BasicCarController'

const wheelCarMapper: CarMapper = {
  buttons: { adelante: 5, atras: 4 },
  axes: { direccion: { x: 0 } },
}

export default class WheelCarController extends BasicCarController {
  constructor(gamepadIndex: number) {
    super(gamepadIndex, wheelCarMapper)
  }
}
