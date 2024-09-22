import AbstractGamepadInput from './AbstractGamepadInput.ts'

export type AbstractGamepadAnalogInputOptions = {
  noiseThreshold?: number
  inputDelta?: number
}

export default abstract class AbstractGamepadAnalogInput extends AbstractGamepadInput {
  private noiseThreshold!: number
  private inputDelta!: number

  protected constructor(
    index: number,
    options: AbstractGamepadAnalogInputOptions = {}
  ) {
    const { noiseThreshold = 0.15, inputDelta = 0.1 } = options
    super(index)
    this.noiseThreshold = noiseThreshold
    this.inputDelta = inputDelta
  }

  public hasBeenUpdated(gamepad: Gamepad): boolean {
    if (this.isOverNoiseThreshold(this.getStatus())) {
      return this.isOverInputDelta(this.getCurrentValue(gamepad))
    }
    return this.isOverNoiseThreshold(this.getCurrentValue(gamepad))
  }

  protected isOverNoiseThreshold(value: number): boolean {
    return Math.abs(value) > this.getNoiseThreshold()
  }

  protected isOverInputDelta(value: number): boolean {
    return Math.abs(value - this.getStatus()) > this.getInputDelta()
  }

  public getNoiseThreshold(): number {
    return this.noiseThreshold
  }

  public setNoiseThreshold(noiseThreshold: number): void {
    if (noiseThreshold < 0) {
      throw new RangeError(
        'noiseThreshold must be a value greater than or equal to zero.'
      )
    }
    if (noiseThreshold > 1) {
      throw new RangeError(
        'noiseThreshold must be a value lower than or equal to one.'
      )
    }
    this.noiseThreshold = noiseThreshold
  }

  public getInputDelta(): number {
    return this.inputDelta
  }

  public setInputDelta(inputDelta: number): void {
    if (inputDelta < 0) {
      throw new RangeError(
        'inputDelta must be a value greater than or equal to zero.'
      )
    }
    if (inputDelta > 1) {
      throw new RangeError(
        'inputDelta must be a value lower than or equal to one.'
      )
    }
    this.inputDelta = inputDelta
  }
}
