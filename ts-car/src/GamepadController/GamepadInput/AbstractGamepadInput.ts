export default abstract class AbstractGamepadInput<TIndex, TStatus> {
  private readonly index: TIndex
  protected status!: TStatus

  protected constructor(index: TIndex) {
    this.index = index
    this.initializeStatus()
  }

  public updateStatus(gamepad: Gamepad): TStatus {
    return (this.status = this.getCurrentValue(gamepad))
  }

  public abstract initializeStatus(): void

  public abstract hasBeenUpdated(gamepad: Gamepad): boolean

  protected abstract getCurrentValue(gamepad: Gamepad): TStatus

  public getStatus(): TStatus {
    return this.status
  }

  public getIndex(): TIndex {
    return this.index
  }
}
