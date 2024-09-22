import AbstractGamepadInput from './AbstractGamepadInput.ts'

export default class DigitalButtonInput extends AbstractGamepadInput<number> {
  public constructor(index: number) {
    super(index)
  }

  protected getCurrentValue(gamepad: Gamepad): number {
    return Number(gamepad.buttons[this.getIndex()].pressed)
  }

  protected hasBeenUpdated(newValue: number): boolean {
    return this.getStatus() !== newValue
  }

  public initializeStatus(): void {
    this.status = 0
  }
}
