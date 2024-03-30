import GamepadComponent from './GamepadComponent'

export type ButtonMapper = Record<string, number>

export default class GamepadButtons<
  T extends ButtonMapper,
> extends GamepadComponent<number, T> {
  protected getNewValue(key: keyof T, newValues: number[]): number {
    return newValues[this.getIndex(key)]
  }

  protected initializeItem(): number {
    return 0
  }

  protected isOverNoiseThreshold(value: number): boolean {
    return value >= this.getNoiseThreshold()
  }

  protected isOverInputDelta(lastValue: number, newValue: number): boolean {
    return Math.abs(newValue - lastValue) >= this.getInputDelta()
  }
}
