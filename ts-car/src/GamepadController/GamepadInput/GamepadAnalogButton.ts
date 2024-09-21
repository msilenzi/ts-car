type GamepadAnalogButtonOptions = {
  noiseThreshold?: number
  inputDelta?: number
}

export default class GamepadAnalogButton {
  private readonly index: number
  private status!: number
  private noiseThreshold!: number
  private inputDelta!: number

  constructor(index: number, options: GamepadAnalogButtonOptions = {}) {
    const { noiseThreshold = 0.15, inputDelta = 0.1 } = options
    this.index = index
    this.initializeStatus()
    this.setNoiseThreshold(noiseThreshold)
    this.setInputDelta(inputDelta)
  }

  public updateStatus(gamepad: Gamepad): number {
    return (this.status = this.getCurrentValue(gamepad))
  }

  public hasBeenUpdated(gamepad: Gamepad): boolean {
    return this.status !== this.getCurrentValue(gamepad)
  }

  public initializeStatus(): void {
    this.status = 0
  }

  public getStatus(): number {
    return this.status
  }

  public getIndex(): number {
    return this.index
  }

  private getCurrentValue(gamepad: Gamepad): number {
    return gamepad.buttons[this.index].value
  }

  public getNoiseThreshold(): number {
    return this.noiseThreshold
  }

  public setNoiseThreshold(noiseThreshold: number): void {
    if (noiseThreshold < 0 || noiseThreshold > 1) {
      throw new RangeError(
        'noiseThreshold should be a value greater than or equal to zero and less than or equal to one.'
      )
    }
    this.noiseThreshold = noiseThreshold
  }

  public getInputDelta(): number {
    return this.inputDelta
  }

  public setInputDelta(inputDelta: number): void {
    if (inputDelta < 0 || inputDelta > 1) {
      throw new RangeError(
        'inputDelta should be a value greater than or equal to zero and less than or equal to one.'
      )
    }
    this.inputDelta = inputDelta
  }
}

/*
[x] index
[x] status
[x] noiseThreshold
[x] inputDelta

[x] updateStatus
[x] hasBeenUpdated
[x] initializeStatus
[x] getStatus
[x] getIndex
[x] getCurrentValue

[x] getNoiseThreshold
[x] setNoiseThreshold
[x] getInputDelta
[x] setInputDelta
*/