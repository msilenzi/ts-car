import GamepadComponent from './GamepadComponent'

export type AxisValue = { x: number; y: number }
export type AxesMapper = Record<string, AxisValue>

export default class GamepadAxes<T extends AxesMapper> extends GamepadComponent<
  AxisValue,
  T
> {
  protected getNewValue(key: keyof T, newValues: number[]): AxisValue {
    return {
      x: newValues[this.getIndex(key).x],
      y: newValues[this.getIndex(key).y],
    }
  }

  protected initializeItem(): AxisValue {
    return { x: 0, y: 0 }
  }

  protected isOverNoiseThreshold(value: AxisValue): boolean {
    const absX = Math.abs(value.x)
    const absY = Math.abs(value.y)

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
      Math.abs(newValue.x - lastValue.x) >= this.getInputDelta() ||
      Math.abs(newValue.y - lastValue.y) >= this.getInputDelta()
    )
  }
}
