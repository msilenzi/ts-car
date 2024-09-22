import { AnalogInputOptions } from './AbstractAnalogInput.ts'
import AbstractSingleAnalogInput from './AbstractSingleAnalogInput.ts'

export default class AnalogButtonInput extends AbstractSingleAnalogInput {
  constructor(index: number, options: AnalogInputOptions = {}) {
    super(index, options)
  }

  protected getCurrentValue(gamepad: Gamepad): number {
    return gamepad.buttons[this.getIndex()].value
  }
}
