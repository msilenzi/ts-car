export type ButtonMapper = Record<string, number>

export default class GamepadButtons<T extends ButtonMapper> {
  private noiseThreshold = 0.15
  private inputDelta = 0.1

  private readonly indexes: T
  private status!: T

  constructor(indexes: T) {
    this.indexes = indexes
    this.initializeStatus()
  }

  public updateStatus(buttons: GamepadButton[]): Partial<T> {
    const updatedValues = Object.keys(this.indexes).reduce((obj, key) => {
      const lastValue = this.status[key]
      const newValue = buttons[this.indexes[key]].value

      if (this.buttonHasBeenUpdated(lastValue, newValue)) {
        if (this.isOverNoiseThreshold(newValue)) {
          return { ...obj, [key]: newValue }
        }
        return { ...obj, [key]: 0 }
      }
      return obj
    }, {} as Partial<T>)

    this.status = Object.assign(this.status, updatedValues)

    return updatedValues
  }

  /**
    - Si ya estaba presionando el botón (lastValueIsOverNoiseThreshold = T),
      entonces solo actualiza si el delta es mayor.
    - Sino, actualiza cuando el nuevo valor supera el umbral de ruido.

    | lastValueIsOverNoiseThreshold | newValueIsOverNoiseThreshold | isOverInputDelta | result |
    | :---------------------------: | :--------------------------: | :--------------: | :----: |
    |               F               |              F               |        X         | **F**  |
    |               F               |              T               |        X         | **T**  |
    |               T               |              X               |        F         | **F**  |
    |               T               |              X               |        T         | **T**  |
  */
  private buttonHasBeenUpdated(lastValue: number, newValue: number): boolean {
    if (this.isOverNoiseThreshold(lastValue)) {
      return this.isOverInputDelta(lastValue, newValue)
    } else {
      return this.isOverNoiseThreshold(newValue)
    }
  }

  private isOverNoiseThreshold(value: number): boolean {
    return value >= this.noiseThreshold
  }

  private isOverInputDelta(lastValue: number, newValue: number): boolean {
    return Math.abs(newValue - lastValue) >= this.inputDelta
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

  public getNoiseThreshold(): number {
    return this.noiseThreshold
  }

  public getInputDelta(): number {
    return this.inputDelta
  }
}
