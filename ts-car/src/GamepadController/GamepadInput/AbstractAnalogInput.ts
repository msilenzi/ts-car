import AbstractGamepadInput, {
  AllowedGamepadInputValues,
} from './AbstractGamepadInput.ts'

export type AnalogInputOptions = {
  noiseThreshold?: number
  inputDelta?: number
}

export default abstract class AbstractAnalogInput<
  T extends AllowedGamepadInputValues,
> extends AbstractGamepadInput<T> {
  private noiseThreshold!: number
  private inputDelta!: number

  protected constructor(index: T, options: AnalogInputOptions = {}) {
    const { noiseThreshold = 0.15, inputDelta = 0.1 } = options
    super(index)
    this.setNoiseThreshold(noiseThreshold)
    this.setInputDelta(inputDelta)
  }

  public updateStatus(gamepad: Gamepad): boolean {
    const newValue = this.getCurrentValue(gamepad)

    if (!this.hasBeenUpdated(newValue)) return false

    if (this.isOverNoiseThreshold(newValue)) {
      this.status = newValue
    } else {
      this.initializeStatus()
    }
    return true
  }

  protected hasBeenUpdated(newValue: T): boolean {
    if (this.isOverNoiseThreshold(this.getStatus())) {
      return this.isOverInputDelta(newValue)
    }
    return this.isOverNoiseThreshold(newValue)
  }

  private isOverNoiseThreshold(value: T): boolean {
    return this.calculateNoiseThreshold(value) > this.noiseThreshold
  }

  private isOverInputDelta(newValue: T): boolean {
    return this.calculateInputDelta(newValue) > this.inputDelta
  }

  protected abstract calculateNoiseThreshold(value: T): number

  protected abstract calculateInputDelta(newValue: T): number

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
