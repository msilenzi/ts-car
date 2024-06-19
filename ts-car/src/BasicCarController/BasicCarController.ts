import GamepadAxes from 'GamepadController/GamepadAxes';
import GamepadButtons from 'GamepadController/GamepadButtons';
import GamepadController from 'GamepadController/GamepadController'

type Instructions = 'adelante' | 'atras' | 'parar' | 'derecha' | 'izquierda'

type CarButtonMapper = { adelante: number; atras: number }
type CarAxesMapper = { direccion: { x: number } }

export type CarMapper = { buttons: CarButtonMapper, axes: CarAxesMapper }

export default class BasicCarController extends GamepadController<
  CarButtonMapper,
  CarAxesMapper
> {
  private lastInstruction: Instructions
  
  constructor(gamepadIndex: number, carMapper: CarMapper) {
    super(
      gamepadIndex,
      new GamepadButtons(carMapper.buttons),
      new GamepadAxes(carMapper.axes),
    )
    this.lastInstruction = 'parar'
  }

  public handleStatusUpdated(): void {
    const { direccion } = this.getStatus().axes
    const { adelante, atras } = this.getStatus().buttons
    
    let newInstruction: Instructions = 'parar'

    if (direccion.x <= -0.5) {
      newInstruction = 'izquierda'
    } else if (direccion.x >= 0.5) {
      newInstruction = 'derecha'
    } else if (adelante >= 0.5) {
      newInstruction = 'adelante'
    } else if (atras >= 0.5) {
      newInstruction = 'atras'
    }
  
    if (newInstruction !== this.lastInstruction) {
      fetch(`${URL}/${newInstruction}`)
      this.lastInstruction = newInstruction
      console.log(newInstruction)
    }
  }
}
