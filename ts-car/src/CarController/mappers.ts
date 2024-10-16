import { CarMapper } from './AbstractCarController'
import DigitalButtonInput from '../GamepadController/GamepadInput/DigitalButtonInput.ts'
import AnalogButtonInput from '../GamepadController/GamepadInput/AnalogButtonInput.ts'
import SingleAxisInput from '../GamepadController/GamepadInput/SingleAxisInput.ts'

export function createXboxCarMapper(): CarMapper {
  return {
    adelante: new AnalogButtonInput(7, { noiseThreshold: 0.1 }),
    atras: new AnalogButtonInput(6, { noiseThreshold: 0.1 }),
    rotarIzq: new DigitalButtonInput(4),
    rotarDer: new DigitalButtonInput(5),
    direccion: new SingleAxisInput(0),
  }
}

export function createWheelCarMapper(): CarMapper {
  return {
    adelante: new DigitalButtonInput(5),
    atras: new DigitalButtonInput(4),
    direccion: new SingleAxisInput(0),
  }
}

export function createDancePadMapper(): CarMapper {
  return {
    adelante: new DigitalButtonInput(0),
    atras: new DigitalButtonInput(1),
    izquierda: new DigitalButtonInput(2),
    derecha: new DigitalButtonInput(3),
  }
}
