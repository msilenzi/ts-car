import GamepadController from 'GamepadController/GamepadController'
import {
  WheelAxesMapper,
  WheelButtonMapper,
  wheelAxesMapper,
  wheelButtonMapper,
} from 'mappers/wheelMapper'

type Instructions = 'adelante' | 'atras' | 'parar' | 'derecha' | 'izquierda'

const URL = 'http://192.168.1.109:1880'

let lastInstruction: Instructions

let wheelController: GamepadController<WheelButtonMapper, WheelAxesMapper>

function handleStatusUpdated() {
  const { direccion } = wheelController.getStatus().axes
  const { adelante, atras } = wheelController.getStatus().buttons

  let newInstruction: Instructions = 'parar'

  if (direccion.x === -1) {
    newInstruction = 'izquierda'
  } else if (direccion.x === 1) {
    newInstruction = 'derecha'
  } else if (adelante === 1) {
    newInstruction = 'adelante'
  } else if (atras === 1) {
    newInstruction = 'atras'
  }

  if (newInstruction !== lastInstruction) {
    fetch(`${URL}/${newInstruction}`)
    lastInstruction = newInstruction
    console.log(newInstruction)
  }
}

window.addEventListener('gamepadconnected', ({ gamepad }) => {
  wheelController = new GamepadController(
    gamepad.index,
    wheelButtonMapper,
    wheelAxesMapper,
    handleStatusUpdated
  )

  wheelController.start()
})
