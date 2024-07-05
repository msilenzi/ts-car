import AbstractCarController, {
  CarMapper,
  Instructions,
} from './AbstractCarController'
import { setLatency } from '../ui/latency.ts'

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
      const startTime = performance.now()
      fetch(`${this.CAR_URL}/${newInstruction}`).then(() => {
        setLatency(performance.now() - startTime)
      })

      this.lastInstruction = newInstruction
      console.log(newInstruction)
    }
  }
}
