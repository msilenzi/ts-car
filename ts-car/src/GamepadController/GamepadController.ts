import AbstractGamepadInput, {
  AllowedGamepadInputValues,
} from './GamepadInput/AbstractGamepadInput.ts'

export type GamepadMapper = Record<
  string,
  AbstractGamepadInput<AllowedGamepadInputValues>
>

export type GamepadStatus<T extends GamepadMapper> = {
  [K in keyof T]: ReturnType<T[K]['getStatus']>
}

export default abstract class GamepadController<T extends GamepadMapper> {
  private readonly POLL_INTERVAL_TIME_MS: number
  private pollInterval: number | null
  private readonly mapper: T
  private readonly gamepadIndex: number

  protected constructor(gamepadIndex: number, mapper: T) {
    this.gamepadIndex = gamepadIndex
    this.mapper = mapper

    this.POLL_INTERVAL_TIME_MS = 50
    this.pollInterval = null
  }

  public start(): void {
    if (this.pollInterval !== null) {
      throw new Error('Gamepad polling already started')
    }

    this.pollInterval = setInterval(() => {
      const gp = navigator.getGamepads()[this.gamepadIndex]
      if (gp === null) throw new Error('Invalid gamepad')

      const updatedStatus: Partial<GamepadStatus<T>> = Object.entries(
        this.mapper
      ).reduce((acc, [key, input]) => {
        if (!input.updateStatus(gp)) return acc
        return { ...acc, [key]: input.getStatus() }
      }, {})

      if (Object.keys(updatedStatus).length !== 0) {
        this.handleStatusUpdated(updatedStatus)
      }
    }, this.POLL_INTERVAL_TIME_MS)
  }

  public stop(): void {
    if (this.pollInterval === null) {
      throw new Error('Gamepad polling already stopped')
    }

    clearInterval(this.pollInterval)
    Object.values(this.mapper).forEach((input) => input.initializeStatus())
    this.handleStatusUpdated(this.getStatus())
    this.pollInterval = null
  }

  public getStatus(): GamepadStatus<T> {
    return Object.entries(this.mapper).reduce((acc, [key, input]) => {
      return { ...acc, [key]: input.getStatus() }
    }, {} as GamepadStatus<T>)
  }

  public abstract handleStatusUpdated(status: Partial<GamepadStatus<T>>): void
}
