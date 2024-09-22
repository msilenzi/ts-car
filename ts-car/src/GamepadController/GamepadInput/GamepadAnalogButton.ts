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
}
