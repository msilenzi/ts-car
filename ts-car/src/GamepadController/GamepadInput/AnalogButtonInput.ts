import AbstractAnalogInput, {
  AbstractGamepadAnalogInputOptions,
} from './AbstractAnalogInput.ts'
import AbstractSingleAnalogInput from './AbstractSingleAnalogInput.ts'

export default class AnalogButtonInput extends AbstractSingleAnalogInput {
  constructor(index: number, options: AbstractGamepadAnalogInputOptions = {}) {
    super(index, options)
  }

  protected getCurrentValue(gamepad: Gamepad): number {
    return gamepad.buttons[this.getIndex()].value
  }
}
