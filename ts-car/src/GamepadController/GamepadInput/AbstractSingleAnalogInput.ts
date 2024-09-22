import AbstractAnalogInput from './AbstractAnalogInput.ts'

export default abstract class AbstractSingleAnalogInput extends AbstractAnalogInput<
  number,
  number
> {
  initializeStatus(): void {
    this.status = 0
  }

  protected isOverInputDelta(newValue: number): boolean {
    return Math.abs(newValue - this.getStatus()) > this.getInputDelta()
  }

  protected isOverNoiseThreshold(value: number): boolean {
    return Math.abs(value) > this.getNoiseThreshold()
  }
}
