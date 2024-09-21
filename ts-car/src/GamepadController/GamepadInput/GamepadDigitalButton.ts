export default class GamepadDigitalButton {
  private readonly index: number
  private status!: number

  constructor(index: number) {
    this.index = index
    this.initializeStatus()
  }

  public updateStatus(gamepad: Gamepad): number {
    return (this.status = this.getCurrentValue(gamepad))
  }

  public hasBeenUpdated(gamepad: Gamepad): boolean {
    return this.status !== this.getCurrentValue(gamepad)
  }

  public initializeStatus(): void {
    this.status = 0
  }

  public getStatus(): number {
    return this.status
  }

  public getIndex(): number {
    return this.index
  }

  private getCurrentValue(gamepad: Gamepad): number {
    return Number(gamepad.buttons[this.index].pressed)
  }
}

/*
  [ ] updateStatus
  [ ] hasBeenUpdated
  [x] initializeStatus
  [-] stop
  [x] getCurrentValue
  [x] getStatus
  [x] getIndex
 */