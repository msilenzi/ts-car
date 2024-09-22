import AbstractCarController, { CarMapper } from './AbstractCarController'
import { setLatency } from '../ui/latency.ts'
import { setStatus } from '../ui/controllerStatus.ts'

export default class AdvancedCarController extends AbstractCarController {
  public constructor(gamepadIndex: number, carMapper: CarMapper, CAR_URL: string) {
    super(gamepadIndex, carMapper, CAR_URL)
  }

  public handleStatusUpdated(): void {
    const startTime = performance.now()
    fetch(`${this.CAR_URL}/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.getStatus()),
    }).then(() => {
      setLatency(performance.now() - startTime)
      setStatus(JSON.stringify(this.getStatus(), null, 2))
    })
  }
}
