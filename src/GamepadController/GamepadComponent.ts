// export type ComponentValue = number | { x: number; y: number }

// export type ComponentMapper = Record<string, ComponentValue>

export default abstract class GamepadComponent<T, U extends Record<string, T>> {
  private noiseThreshold = 0.15
  private inputDelta = 0.1

  private readonly indexes: U
  private status!: U

  constructor(indexes: U) {
    this.indexes = indexes
    this.initializeStatus()
  }

  public updateStatus(newValues: number[]): Partial<U> {
    const updatedValues = Object.keys(this.indexes).reduce((obj, key) => {
      const lastValue = this.status[key]
      const newValue = this.getNewValue(key, newValues)

      if (this.hasBeenUpdated(lastValue, newValue)) {
        if (this.isOverNoiseThreshold(newValue)) {
          return { ...obj, [key]: newValue }
        }
        return { ...obj, [key]: this.initializeItem() }
      }
      return obj
    }, {} as Partial<U>)

    this.status = { ...this.status, ...updatedValues }
    return updatedValues
  }
  protected abstract getNewValue(key: keyof U, newValues: number[]): T
  protected abstract initializeItem(): T

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
  private hasBeenUpdated(lastValue: T, newValue: T): boolean {
    if (this.isOverNoiseThreshold(lastValue)) {
      return this.isOverInputDelta(lastValue, newValue)
    } else {
      return this.isOverNoiseThreshold(newValue)
    }
  }
  protected abstract isOverNoiseThreshold(value: T): boolean
  protected abstract isOverInputDelta(lastValue: T, newValue: T): boolean

  private initializeStatus(): void {
    this.status = Object.keys(this.indexes).reduce(
      (obj, key) => ({ ...obj, [key]: this.initializeItem() }),
      {} as U
    )
  }

  //
  // Getters y setters
  //

  public getStatus(): U {
    return this.status
  }

  public getIndexes(): U {
    return this.indexes
  }

  public getIndex(key: keyof U): T {
    return this.indexes[key]
  }

  public getNoiseThreshold(): number {
    return this.noiseThreshold
  }

  public setNoiseThreshold(noiseThreshold: number): void {
    if (noiseThreshold < 0 || noiseThreshold > 1) {
      throw new Error(
        'noiseThreshold should be a value greater than zero and less than one.'
      )
    }
    this.noiseThreshold = noiseThreshold
  }

  public getInputDelta(): number {
    return this.inputDelta
  }

  public setInputDelta(inputDelta: number): void {
    if (inputDelta < 0 || inputDelta > 1) {
      throw new Error(
        'inputDelta should be a value greater than zero and less than one.'
      )
    }
    this.inputDelta = inputDelta
  }
}
