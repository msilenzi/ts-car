import AbstractGamepadAnalogInput, {
  AbstractGamepadAnalogInputOptions,
} from './AbstractGamepadAnalogInput.ts'

export default class GamepadSingleAxis extends AbstractGamepadAnalogInput {
  public constructor(
    index: number,
    options: AbstractGamepadAnalogInputOptions = {}
  ) {
    super(index, options)
  }

  protected getCurrentValue(gamepad: Gamepad): number {
    return gamepad.axes[this.getIndex()]
  }
}
