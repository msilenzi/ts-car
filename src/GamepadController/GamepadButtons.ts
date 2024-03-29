type ButtonMapper = Record<string, number>

export default class GamepadButtons<T extends ButtonMapper> {
  private noiseThreshold = 0.15
  private inputDelta = 0.1

  private readonly indexes: T
  private status!: T

  constructor(indexes: T) {
    this.indexes = indexes
    this.initializeStatus()
  }

  private initializeStatus(): void {
    this.status = Object.keys(this.indexes).reduce(
      (obj, key) => ({ ...obj, [key]: 0 }),
      {} as T
    )
  }

  public setNoiseThreshold(noiseThreshold: number): void {
    this.noiseThreshold = noiseThreshold
  }

  public setInputDelta(inputDelta: number): void {
    this.inputDelta = inputDelta
  }

  public getStatus(): T {
    return this.status
  }

  public getIndexes(): T {
    return this.indexes
  }
}
