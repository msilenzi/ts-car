import GamepadComponent from './GamepadComponent'

export type AxisValue = { x?: number; y?: number }
export type AxesMapper = Record<string, AxisValue>

export default class GamepadAxes<T extends AxesMapper> extends GamepadComponent<
  AxisValue,
  T
> {
  protected getNewValue(key: keyof T, newValues: number[]): AxisValue {
    const index = this.getIndex(key)

    return {
      x: index.x != undefined ? newValues[index.x] : 0,
      y: index.y != undefined ? newValues[index.y] : 0,
    }
  }

  protected initializeInput(): AxisValue {
    return { x: 0, y: 0 }
  }

  protected isOverNoiseThreshold(value: AxisValue): boolean {
    const absX = Math.abs(value.x ?? 0)
    const absY = Math.abs(value.y ?? 0)

    return (
      absX > this.getNoiseThreshold() ||
      absY > this.getNoiseThreshold() ||
      absX + absY > this.getNoiseThreshold()
    )
  }

  protected isOverInputDelta(
    lastValue: AxisValue,
    newValue: AxisValue
  ): boolean {
    return (
      (newValue.x !== undefined &&
        lastValue.x !== undefined &&
        Math.abs(newValue.x - lastValue.x) >= this.getInputDelta()) ||
      (newValue.y !== undefined &&
        lastValue.y !== undefined &&
        Math.abs(newValue.y - lastValue.y) >= this.getInputDelta())
    )
  }
}
