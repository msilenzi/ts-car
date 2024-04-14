import CarController, { CarMapper } from './CarController'

const wheelCarMapper: CarMapper = {
  buttons: {
    adelante: 5,
    atras: 4,
  },
  axes: {
    direccion: { x: 0 },
  },
}

export default class WheelCarController extends CarController {
  constructor(gamepadIndex: number) {
    super(gamepadIndex, wheelCarMapper)
  }
}
