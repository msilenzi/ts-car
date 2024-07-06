import { CarMapper } from './AbstractCarController'

export const xboxCarMapper: CarMapper = {
  buttons: { adelante: 7, atras: 6, rotarIzq: 4, rotarDer: 5 },
  axes: { direccion: { x: 0 } },
}

export const wheelCarMapper: CarMapper = {
  buttons: { adelante: 5, atras: 4 },
  axes: { direccion: { x: 0 } },
}
