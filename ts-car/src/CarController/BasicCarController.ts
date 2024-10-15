import AbstractCarController, { CarMapper } from './AbstractCarController'
import { setLatency } from '../ui/latency.ts'
import { setControllerStatus } from '../ui/controllerStatus.ts'

type Instructions = 'adelante' | 'atras' | 'parar' | 'derecha' | 'izquierda'

export default class BasicCarController extends AbstractCarController {
  private lastInstruction: Instructions

  public constructor(
    gamepadIndex: number,
    carMapper: CarMapper,
    CAR_URL: string
  ) {
    super(gamepadIndex, carMapper, CAR_URL)
    this.lastInstruction = 'parar'
  }

  public handleStatusUpdated(): void {
    const { adelante, atras, izquierda, derecha, direccion } = this.getStatus()
    let newInstruction: Instructions = 'parar'

    if (direccion <= -0.5 || izquierda >= 0.5) {
      newInstruction = 'izquierda'
    } else if (direccion >= 0.5 || derecha >= 0.5) {
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
      setControllerStatus(newInstruction)
    }
  }
}
