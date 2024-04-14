import CarController, { CarMapper } from './CarController'

const xboxCarMapper: CarMapper = {
  buttons: { adelante: 7, atras: 6 },
  axes: { direccion: { x: 0 } },
}

export default class XboxCarController extends CarController {
  constructor(gamepadIndex: number) {
    super(gamepadIndex, xboxCarMapper)
  }
}
