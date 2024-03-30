type AxisValue = { x: number; y: number }

export type AxesMapper = Record<string, AxisValue>

export default class GamepadAxes<T extends AxesMapper> {
  private noiseThreshold = 0.15
  private inputDelta = 0.1

  private readonly indexes: T
  private status!: T

  constructor(indexes: T) {
    this.indexes = indexes
    this.initializeStatus()
  }

  public updateStatus(buttons: readonly number[]): Partial<T> {
    const updatedValues = Object.keys(this.indexes).reduce((obj, key) => {
      const lastValue = this.status[key]
      const newValue = {
        x: buttons[this.indexes[key].x],
        y: buttons[this.indexes[key].y],
      }

      if (this.buttonHasBeenUpdated(lastValue, newValue)) {
        if (this.isOverNoiseThreshold(newValue)) {
          return { ...obj, [key]: newValue }
        }
        return { ...obj, [key]: { x: 0, y: 0 } }
      }
      return obj
    }, {} as Partial<T>)

    this.status = Object.assign(this.status, updatedValues)

    return updatedValues
  }

  private buttonHasBeenUpdated(
    lastValue: AxisValue,
    newValue: AxisValue
  ): boolean {
    if (this.isOverNoiseThreshold(lastValue)) {
      return this.isOverInputDelta(lastValue, newValue)
    } else {
      return this.isOverNoiseThreshold(newValue)
    }
  }

  private isOverNoiseThreshold(value: AxisValue): boolean {
    const absX = Math.abs(value.x)
    const absY = Math.abs(value.y)

    return (
      absX > this.noiseThreshold ||
      absY > this.noiseThreshold ||
      absX + absY > this.noiseThreshold
    )
  }

  private isOverInputDelta(lastValue: AxisValue, newValue: AxisValue): boolean {
    return (
      Math.abs(newValue.x - lastValue.x) >= this.inputDelta ||
      Math.abs(newValue.y - lastValue.y) >= this.inputDelta
    )
  }

  private initializeStatus(): void {
    this.status = Object.keys(this.indexes).reduce(
      (obj, key) => ({ ...obj, [key]: { x: 0, y: 0 } }),
      {} as T
    )
  }

  public setNoiseThreshold(noiseThreshold: number): void {
    if (noiseThreshold < 0 || noiseThreshold > 1) {
      throw new Error(
        'noiseThreshold should be a value greater than zero and less than one.'
      )
    }
    this.noiseThreshold = noiseThreshold
  }

  public setInputDelta(inputDelta: number): void {
    if (inputDelta < 0 || inputDelta > 1) {
      throw new Error(
        'inputDelta should be a value greater than zero and less than one.'
      )
    }
    this.inputDelta = inputDelta
  }

  public getStatus(): T {
    return this.status
  }

  public getIndexes(): T {
    return this.indexes
  }

  public getNoiseThreshold(): number {
    return this.noiseThreshold
  }

  public getInputDelta(): number {
    return this.inputDelta
  }
}
