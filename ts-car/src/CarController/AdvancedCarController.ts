import AbstractCarController, {
  CarAxesMapper,
  CarButtonMapper,
  CarMapper,
} from './AbstractCarController'

export default class AdvancedCarController extends AbstractCarController {
  private CAR_URL: string

  constructor(gamepadIndex: number, carMapper: CarMapper, CAR_URL: string) {
    super(gamepadIndex, carMapper)
    this.CAR_URL = CAR_URL
  }

  public handleStatusUpdated(status: {
    buttons: Partial<CarButtonMapper>
    axes: Partial<CarAxesMapper>
  }): void {
    // console.log(JSON.stringify(status, null, 2))
    console.log(JSON.stringify(this.getStatus(), null, 2))

    fetch(`${this.CAR_URL}/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.getStatus())
    });
  }
}
