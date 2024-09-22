import AbstractAnalogInput, {
  AbstractGamepadAnalogInputOptions,
} from './AbstractAnalogInput.ts'

export default class GamepadAnalogButton extends AbstractAnalogInput {
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
