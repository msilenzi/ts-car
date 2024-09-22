import AbstractGamepadAnalogInput, {
  AbstractGamepadAnalogInputOptions,
} from './AbstractGamepadAnalogInput.ts'

export default class GamepadAnalogButton extends AbstractGamepadAnalogInput {
  public constructor(
    index: number,
    options: AbstractGamepadAnalogInputOptions = {}
  ) {
    super(index, options)
  }

  protected getCurrentValue(gamepad: Gamepad): number {
    return gamepad.buttons[this.getIndex()].value
  }

  protected isOverInputDelta(value: number): boolean {
    return Math.abs(value - this.getStatus()) > this.getInputDelta()
  }

  protected isOverNoiseThreshold(value: number): boolean {
    return value > this.getNoiseThreshold()
  }
}
