import AbstractAnalogInput, {
  AbstractGamepadAnalogInputOptions,
} from './AbstractAnalogInput.ts'

export default class SingleAxisInput extends AbstractAnalogInput {
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
