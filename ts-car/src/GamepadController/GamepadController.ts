import GamepadAxes, { AxesMapper } from './GamepadAxes'
import GamepadButtons, { ButtonMapper } from './GamepadButtons'

export default abstract class GamepadController<
  T extends ButtonMapper,
  U extends AxesMapper,
> {
  private readonly pollIntervalMs: number
  private interval: number | null
  private buttons: GamepadButtons<T>
  private axes: GamepadAxes<U>
  private readonly gamepadIndex: number

  protected constructor(
    gamepadIndex: number,
    gamepadButtons: GamepadButtons<T>,
    gamepadAxes: GamepadAxes<U>
  ) {
    this.pollIntervalMs = 50
    this.interval = null

    this.gamepadIndex = gamepadIndex
    this.buttons = gamepadButtons
    this.axes = gamepadAxes
  }

  public start(): void {
    if (this.interval !== null) {
      throw new Error('Gamepad already started')
    }

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
    if (this.interval === null) {
      throw new Error('Gamepad already stopped')
    }

    clearInterval(this.interval)
    this.buttons.stop()
    this.axes.stop()
    this.handleStatusUpdated(this.getStatus())
    this.interval = null
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
