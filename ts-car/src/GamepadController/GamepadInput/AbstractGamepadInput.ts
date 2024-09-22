export default abstract class AbstractGamepadInput {
  private readonly index: number
  private status!: number

  protected constructor(index: number) {
    this.index = index
    this.initializeStatus()
  }

  public updateStatus(gamepad: Gamepad): number {
    return (this.status = this.getCurrentValue(gamepad))
  }

  public initializeStatus(): void {
    this.status = 0
  }

  public abstract hasBeenUpdated(gamepad: Gamepad): boolean

  protected abstract getCurrentValue(gamepad: Gamepad): number

  public getStatus(): number {
    return this.status
  }

  public getIndex(): number {
    return this.index
  }
}
