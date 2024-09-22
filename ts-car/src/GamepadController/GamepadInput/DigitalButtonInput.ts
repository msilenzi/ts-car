import AbstractGamepadInput from './AbstractGamepadInput.ts'

export default class DigitalButtonInput extends AbstractGamepadInput<
  number,
  number
> {
  public constructor(index: number) {
    super(index)
  }

  protected getCurrentValue(gamepad: Gamepad): number {
    return Number(gamepad.buttons[this.getIndex()].pressed)
  }

  public hasBeenUpdated(gamepad: Gamepad): boolean {
    return this.getStatus() !== this.getCurrentValue(gamepad)
  }

  public initializeStatus(): void {
    this.status = 0
  }
}
