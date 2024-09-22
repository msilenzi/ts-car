import AbstractAnalogInput, {
  AnalogInputOptions,
} from './AbstractAnalogInput.ts'

type DualAxisValue = { x: number; y: number }

export default class DualAxisInput extends AbstractAnalogInput<
  DualAxisValue,
  DualAxisValue
> {
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

  protected isOverInputDelta(newValue: DualAxisValue): boolean {
    const distance = this.calculateEuclideanDistance(this.getStatus(), newValue)
    return distance > this.getInputDelta()
  }

  protected isOverNoiseThreshold(value: DualAxisValue): boolean {
    const distance = this.calculateEuclideanDistance({ x: 0, y: 0 }, value)
    return distance > this.getNoiseThreshold()
  }

  private calculateEuclideanDistance(
    orig: DualAxisValue,
    dest: DualAxisValue
  ): number {
    return Math.sqrt((dest.x - orig.x) ** 2 + (dest.y - orig.y) ** 2)
  }
}
