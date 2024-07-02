import GamepadAxes, { AxesMapper } from './GamepadAxes'
import GamepadButtons, { ButtonMapper } from './GamepadButtons'

export default abstract class GamepadController<
  T extends ButtonMapper,
  U extends AxesMapper,
> {
  private readonly pollIntervalMs: number
  private interval: number
  private buttons: GamepadButtons<T>
  private axes: GamepadAxes<U>
  private readonly gamepadIndex: number

  protected constructor(
    gamepadIndex: number,
    gamepadButtons: GamepadButtons<T>,
    gamepadAxes: GamepadAxes<U>
  ) {
    this.pollIntervalMs = 50
    this.interval = 0

    this.gamepadIndex = gamepadIndex
    this.buttons = gamepadButtons
    this.axes = gamepadAxes
  }

  public start(): void {
    this.interval = setInterval(() => {
      const gamepad = navigator.getGamepads()[this.gamepadIndex]!

      const updatedStatus = {
        buttons: this.buttons.updateStatus(
          gamepad.buttons.map(({ value }) => value)
        ),
        axes: this.axes.updateStatus([...gamepad.axes]),
      }

      if (
        Object.keys(updatedStatus.buttons).length !== 0 ||
        Object.keys(updatedStatus.axes).length !== 0
      ) {
        this.handleStatusUpdated(updatedStatus)
      }
    }, this.pollIntervalMs)
  }

  public stop(): void {
    if (this.interval !== 0) {
      clearInterval(this.interval)
      this.buttons.stop()
      this.axes.stop()
      this.handleStatusUpdated(this.getStatus())
    }
  }

  public getStatus(): { buttons: T; axes: U } {
    return {
      buttons: this.buttons.getStatus(),
      axes: this.axes.getStatus(),
    }
  }

  public abstract handleStatusUpdated(status: {
    buttons: Partial<T>
    axes: Partial<U>
  }): void
}
