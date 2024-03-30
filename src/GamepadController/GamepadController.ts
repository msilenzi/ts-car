import GamepadAxes, { AxesMapper } from './GamepadAxes'
import GamepadButtons, { ButtonMapper } from './GamepadButtons'

type StatusUpdatedHandler<T, U> = (status: {
  buttons: Partial<T>
  axes: Partial<U>
}) => void

export default class GamepadController<
  T extends ButtonMapper,
  U extends AxesMapper,
> {
  private pollIntervalMs: number
  private interval: number
  private buttons: GamepadButtons<T>
  private axes: GamepadAxes<U>
  private readonly gamepadIndex: number
  private handleStatusUpdated: StatusUpdatedHandler<T, U>

  constructor(
    gamepadIndex: number,
    buttonMapper: T,
    axesMapper: U,
    handleStatusUpdated: StatusUpdatedHandler<T, U>
  ) {
    this.pollIntervalMs = 50
    this.interval = 0

    this.gamepadIndex = gamepadIndex
    this.buttons = new GamepadButtons(buttonMapper)
    this.axes = new GamepadAxes(axesMapper)
    this.handleStatusUpdated = handleStatusUpdated
  }

  public start(): void {
    setInterval(() => {
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
      // Disparar handleStatusUpdated con todos los valores en 0
    }
  }

  public getStatus(): { buttons: T; axes: U } {
    return {
      buttons: this.buttons.getStatus(),
      axes: this.axes.getStatus(),
    }
  }
}
