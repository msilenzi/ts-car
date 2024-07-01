import AbstractCarController, {
  CarMapper,
  Instructions,
} from './AbstractCarController'

export default class BasicCarController extends AbstractCarController {
  private lastInstruction: Instructions

  constructor(gamepadIndex: number, carMapper: CarMapper, CAR_URL: string) {
    super(gamepadIndex, carMapper, CAR_URL)
    this.lastInstruction = 'parar'
  }

  public handleStatusUpdated(): void {
    const { direccion } = this.getStatus().axes
    const { adelante, atras } = this.getStatus().buttons

    let newInstruction: Instructions = 'parar'

    if (direccion.x <= -0.5) {
      newInstruction = 'izquierda'
    } else if (direccion.x >= 0.5) {
      newInstruction = 'derecha'
    } else if (adelante >= 0.5) {
      newInstruction = 'adelante'
    } else if (atras >= 0.5) {
      newInstruction = 'atras'
    }

    if (newInstruction !== this.lastInstruction) {
      fetch(`${this.CAR_URL}/${newInstruction}`)
      this.lastInstruction = newInstruction
      console.log(newInstruction)
    }
  }
}
