import AbstractAnalogInput from './AbstractAnalogInput.ts'

export default abstract class AbstractSingleAnalogInput extends AbstractAnalogInput<
  number,
  number
> {
  initializeStatus(): void {
    this.status = 0
  }

  protected calculateNoiseThreshold(value: number): number {
    return Math.abs(value)
  }

  protected calculateInputDelta(newValue: number): number {
    return Math.abs(newValue - this.getStatus())
  }
}
