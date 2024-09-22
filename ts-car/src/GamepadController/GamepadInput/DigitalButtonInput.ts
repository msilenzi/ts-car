import AbstractGamepadInput from './AbstractGamepadInput.ts'

export default class DigitalButtonInput extends AbstractGamepadInput {
  public constructor(index: number) {
    super(index)
  }

  public hasBeenUpdated(gamepad: Gamepad): boolean {
    return this.getStatus() !== this.getCurrentValue(gamepad)
  }

  protected getCurrentValue(gamepad: Gamepad): number {
    return Number(gamepad.buttons[this.getIndex()].pressed)
  }
}
