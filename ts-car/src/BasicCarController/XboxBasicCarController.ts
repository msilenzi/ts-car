import BasicCarController, { CarMapper } from './BasicCarController'

const xboxCarMapper: CarMapper = {
  buttons: { adelante: 7, atras: 6 },
  axes: { direccion: { x: 0 } },
}

export default class XboxCarController extends BasicCarController {
  constructor(gamepadIndex: number) {
    super(gamepadIndex, xboxCarMapper)
  }
}
