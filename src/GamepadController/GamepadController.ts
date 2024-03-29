import GamepadButtons, { ButtonMapper } from './GamepadButtons'

type StatusUpdatedHandler<T> = (status: Partial<T>) => void

export default class GamepadController<T extends ButtonMapper> {
  private pollIntervalMs: number
  private interval: number
  private buttons: GamepadButtons<T>
  private readonly gamepadIndex: number
  private handleStatusUpdated: StatusUpdatedHandler<T>

  constructor(
    gamepadIndex: number,
    buttonMapper: T,
    handleStatusUpdated: StatusUpdatedHandler<T>
  ) {
    this.pollIntervalMs = 50
    this.interval = 0

    this.gamepadIndex = gamepadIndex
    this.buttons = new GamepadButtons(buttonMapper)
    this.handleStatusUpdated = handleStatusUpdated
  }

  public start(): void {
    setInterval(() => {
      const gamepad = navigator.getGamepads()[this.gamepadIndex]!
      const updatedStatus = this.buttons.updateStatus([...gamepad.buttons])
      if (Object.keys(updatedStatus).length !== 0) {
        this.handleStatusUpdated(updatedStatus)
      }
    }, this.pollIntervalMs)
  }

  public stop(): void {
    if (this.interval !== 0) {
      clearInterval(this.interval)
      // Disparar handleStatusUpdated con todos los valores en 0
    }
  }

  public getStatus(): T {
    return this.buttons.getStatus()
  }
}
