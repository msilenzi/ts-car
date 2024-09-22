import AbstractAnalogInput, {
  AbstractGamepadAnalogInputOptions,
} from './AbstractAnalogInput.ts'
import AbstractSingleAnalogInput from './AbstractSingleAnalogInput.ts'

export default class SingleAxisInput extends AbstractSingleAnalogInput {
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
