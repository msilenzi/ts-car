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

  public updateStatus(gamepad: Gamepad): T {
    return (this.status = this.getCurrentValue(gamepad))
  }

  public abstract initializeStatus(): void

  public abstract hasBeenUpdated(gamepad: Gamepad): boolean

  protected abstract getCurrentValue(gamepad: Gamepad): T

  public getStatus(): T {
    return this.status
  }

  public getIndex(): T {
    return this.index
  }
}
