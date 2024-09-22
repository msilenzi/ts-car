export type DualAxisValue = { x: number; y: number }
export type AllowedGamepadInputValues = number | DualAxisValue

export default abstract class AbstractGamepadInput<
  T extends AllowedGamepadInputValues,
> {
  private readonly index: T
  protected status!: T

  protected constructor(index: T) {
    this.index = index
    this.initializeStatus()
  }

  public updateStatus(gamepad: Gamepad): boolean {
    if (!this.hasBeenUpdated(gamepad)) return false
    this.status = this.getCurrentValue(gamepad)
    return true
  }

  public abstract initializeStatus(): void

  protected abstract hasBeenUpdated(gamepad: Gamepad): boolean

  protected abstract getCurrentValue(gamepad: Gamepad): T

  public getStatus(): T {
    return this.status
  }

  public getIndex(): T {
    return this.index
  }
}
