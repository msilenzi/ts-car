import AbstractAnalogInput, {
  AnalogInputOptions,
} from './AbstractAnalogInput.ts'
import { DualAxisValue } from './AbstractGamepadInput.ts'

export default class DualAxisInput extends AbstractAnalogInput<DualAxisValue> {
  public constructor(index: DualAxisValue, options: AnalogInputOptions = {}) {
    super(index, options)
  }

  protected getCurrentValue(gamepad: Gamepad): DualAxisValue {
    return {
      x: gamepad.axes[this.getIndex().x],
      y: gamepad.axes[this.getIndex().y],
    }
  }

  initializeStatus(): void {
    this.status = { x: 0, y: 0 }
  }

  protected calculateNoiseThreshold(value: DualAxisValue): number {
    return this.calculateEuclideanDistance({ x: 0, y: 0 }, value)
  }

  protected calculateInputDelta(newValue: DualAxisValue): number {
    return this.calculateEuclideanDistance(this.getStatus(), newValue)
  }

  private calculateEuclideanDistance(
    orig: DualAxisValue,
    dest: DualAxisValue
  ): number {
    return Math.sqrt((dest.x - orig.x) ** 2 + (dest.y - orig.y) ** 2)
  }
}
