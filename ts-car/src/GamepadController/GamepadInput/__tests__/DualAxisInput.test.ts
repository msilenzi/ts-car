import { beforeEach, describe, expect, test } from 'vitest'
import DualAxisInput from '../DualAxisInput.ts'

describe('DualAxisInput', () => {
  let dualAxis: DualAxisInput
  const gamepadMock = { axes: [0.5, 0.6] } as unknown as Gamepad

  beforeEach(() => {
    dualAxis = new DualAxisInput(
      { x: 0, y: 1 },
      { noiseThreshold: 0.4, inputDelta: 0.2 }
    )
  })

  describe('updateStatus', () => {
    test('Debe devolver false si ya estaba siendo accionada la entrada y el delta es menor', () => {
      const gpMock = { axes: [0.5, 0.6] } as unknown as Gamepad
      dualAxis.updateStatus(gamepadMock) // Accionar la entrada
      expect(dualAxis.updateStatus(gpMock)).toBeFalsy()
    })

    test('Debe devolver true si ya estaba siendo accionada la entrada y el delta es mayor', () => {
      const gpMock = { axes: [0.5, 0.8] } as unknown as Gamepad
      dualAxis.updateStatus(gamepadMock) // Accionar la entrada
      expect(dualAxis.updateStatus(gpMock)).toBeTruthy()
      expect(dualAxis.getStatus()).toStrictEqual({ x: 0.5, y: 0.8 })
    })

    test('Debe devolver false si no estaba siendo accionada la entrada y está por debajo del umbral de ruido', () => {
      const gpMock = { axes: [0.1, 0.1] } as unknown as Gamepad
      expect(dualAxis.updateStatus(gpMock)).toBeFalsy()
    })

    test('Debe devolver true si no estaba siendo accionada la entrada y está por encima del umbral de ruido', () => {
      const gpMock = { axes: [0.5, 0.8] } as unknown as Gamepad
      expect(dualAxis.updateStatus(gpMock)).toBeTruthy()
      expect(dualAxis.getStatus()).toStrictEqual({ x: 0.5, y: 0.8 })
    })
  })
})
