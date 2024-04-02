/**
 * Clase abstracta que representa un componente genérico de un gamepad, como los sticks o los botones.
 * @template T Tipo de datos del componente (e.g., AxisValue para los sticks, number para los botones).
 * @template U Tipo de mapeo utilizado para indexar las entradas del gamepad.
 */
export default abstract class GamepadComponent<T, U extends Record<string, T>> {
  /**
   * Umbral de ruido para determinar si un cambio en la entrada es significativo.
   * @type {number}
   * @private
   */
  private noiseThreshold = 0.15

  /**
   * Delta de entrada para determinar si un cambio en la entrada es significativo.
   * @type {number}
   * @private
   */
  private inputDelta = 0.1

  /**
   * Índices para mapear las entradas del gamepad a valores específicos.
   * @type {U}
   * @private
   */
  private readonly indexes: U

  /**
   * Estado actual del componente del gamepad.
   * @type {U}
   * @private
   */
  private status!: U

  /**
   * Constructor para inicializar la instancia del componente del gamepad.
   * @param {U} indexes Índices para mapear las entradas del gamepad a valores específicos.
   */
  constructor(indexes: U) {
    this.indexes = indexes
    this.initializeStatus()
  }

  /**
   * Actualiza el estado del gamepad con nuevas entradas.
   * @param {number[]} newValues Nuevos valores de entrada del gamepad.
   * @returns {Partial<U>} Objeto que representa los valores actualizados del gamepad.
   */
  public updateStatus(newValues: number[]): Partial<U> {
    // Actualiza el estado para cada índice si la entrada ha cambiado significativamente
    const updatedValues = Object.keys(this.indexes).reduce((obj, key) => {
      const lastValue = this.status[key]
      const newValue = this.getNewValue(key, newValues)

      if (this.hasBeenUpdated(lastValue, newValue)) {
        if (this.isOverNoiseThreshold(newValue)) {
          // Guarda el nuevo valor si supera el umbral de ruido
          // (se está accionando la entrada).
          return { ...obj, [key]: newValue }
        }
        // Guarda el valor inicial si no supera el umbral de ruido
        // (se dejó de accionar una entrada).
        return { ...obj, [key]: this.initializeInput() }
      }

      // Retorna el objeto sin cambios si el valor no ha sido actualizado significativamente.
      return obj
    }, {} as Partial<U>)

    // Actualiza el estado actual con los cambios significativos.
    this.status = { ...this.status, ...updatedValues }
    return updatedValues
  }

  /**
   * Obtener el nuevo valor de una entrada.
   * @abstract
   * @param {keyof U} key Clave que representa el componente dentro del mapeo.
   * @param {number[]} newValues Nuevos valores de entrada del gamepad.
   * @returns {T} Nuevo valor de la entrada.
   */
  protected abstract getNewValue(key: keyof U, newValues: number[]): T

  /**
   * Devuelve el valor inicial de una entrada.
   * @abstract
   * @returns {T} Nuevo valor inicial de la entrada.
   */
  protected abstract initializeInput(): T

  /**
   * Determina si un valor supera el umbral de ruido.
   * @abstract
   * @param {T} value Valor a evaluar.
   * @returns {boolean} `true` si el valor supera el umbral de ruido, `false` en caso contrario.
   */
  protected abstract isOverNoiseThreshold(value: T): boolean

  /**
   * Determina si un cambio en el valor del componente supera el delta de entrada.
   * @abstract
   * @param {T} lastValue Valor anterior del componente.
   * @param {T} newValue Nuevo valor del componente.
   * @returns {boolean} `true` si el cambio supera el delta de entrada, `false` en caso contrario.
   */
  protected abstract isOverInputDelta(lastValue: T, newValue: T): boolean

  /**
   * Método privado para determinar si un valor ha sido actualizado significativamente.
   * - Si ya estaba siendo accionada la entrada
   * (`this.isOverNoiseThreshold(lastValue) === true`), entonces retorna si el delta es mayor
   * - Sino, retorna si el nuevo valor supera el umbral de ruido.
   * 
   * | isOverNoiseThreshold(lastValue) | isOverNoiseThreshold(newValue) | isOverInputDelta | result |
   * | :-----------------------------: | :----------------------------: | :--------------: | :----: |
   * |                F                |               F                |        X         | **F**  |
   * |                F                |               T                |        X         | **T**  |
   * |                T                |               X                |        F         | **F**  |
   * |                T                |               X                |        T         | **T**  |
   * 
   * @private
   * @param {T} lastValue Valor anterior del componente.
   * @param {T} newValue Nuevo valor del componente.
   * @returns {boolean} `true` si el valor ha sido actualizado, `false` en caso contrario.
   * 
   */
  private hasBeenUpdated(lastValue: T, newValue: T): boolean {
    if (this.isOverNoiseThreshold(lastValue)) {
      return this.isOverInputDelta(lastValue, newValue)
    } else {
      return this.isOverNoiseThreshold(newValue)
    }
  }

  /**
   * Método privado para inicializar el estado del gamepad. Inicializa todas las entradas
   * @private
   */
  private initializeStatus(): void {
    this.status = Object.keys(this.indexes).reduce(
      (obj, key) => ({ ...obj, [key]: this.initializeInput() }),
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
