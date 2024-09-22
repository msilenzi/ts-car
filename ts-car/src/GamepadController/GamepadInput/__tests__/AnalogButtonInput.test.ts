import { beforeEach, describe, expect, test } from 'vitest'
import AnalogButtonInput from '../AnalogButtonInput.ts'

describe('AnalogButtonInput', () => {
  const gamepadButtonIndex = 1
  let gamepadButton: AnalogButtonInput
  let gamepadMock: Gamepad

  beforeEach(() => {
    gamepadButton = new AnalogButtonInput(gamepadButtonIndex, {
      noiseThreshold: 0.25,
      inputDelta: 0.2,
    })
    gamepadMock = {
      buttons: [{ value: 0.2 }, { value: 0.3 }, { value: 0 }],
    } as unknown as Gamepad
  })

  describe('constructor', () => {
    test('debe inicializar correctamente las opciones', () => {
      expect(gamepadButton.getNoiseThreshold()).toBe(0.25)
      expect(gamepadButton.getInputDelta()).toBe(0.2)
    })

    test('debe inicializar las opciones con valores por defecto', () => {
      const btn = new AnalogButtonInput(1)
      expect(btn.getNoiseThreshold()).toBe(0.15)
      expect(btn.getInputDelta()).toBe(0.1)
    })
  })

  describe('updateStatus', () => {
    test('debe actualizar correctamente el estado', () => {
      expect(gamepadButton.updateStatus(gamepadMock)).toBe(0.3)
      expect(gamepadButton.getStatus()).toBe(0.3)
    })
  })

  describe('hasBeenUpdated', () => {
    test('Debe devolver false si ya estaba siendo accionada la entrada y el delta es menor', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.5 }],
      } as unknown as Gamepad
      gamepadButton.updateStatus(gamepadMock) // Accionar la entrada
      expect(gamepadButton.hasBeenUpdated(gpMock)).toBeFalsy()
    })

    test('Debe devolver true si ya estaba siendo accionada la entrada y el delta es mayor', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.51 }],
      } as unknown as Gamepad
      gamepadButton.updateStatus(gamepadMock) // Accionar la entrada
      expect(gamepadButton.hasBeenUpdated(gpMock)).toBeTruthy()
    })

    test('Debe devolver true si no estaba siendo accionada la entrada y está por encima del umbral de ruido', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.26 }],
      } as unknown as Gamepad
      expect(gamepadButton.hasBeenUpdated(gpMock)).toBeTruthy()
    })

    test('Debe devolver false si no estaba siendo accionada la entrada y está por debajo del umbral de ruido', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.25 }],
      } as unknown as Gamepad
      expect(gamepadButton.hasBeenUpdated(gpMock)).toBeFalsy()
    })

    test('debe indicar si el estado del botón en el gamepad cambió', () => {
      expect(gamepadButton.hasBeenUpdated(gamepadMock)).toBeTruthy()
    })
  })

  describe('setNoiseThreshold', () => {
    test('debe fallar si el nuevo valor es menor a 0', () => {
      expect(() => gamepadButton.setNoiseThreshold(-0.1)).toThrowError(
        'noiseThreshold must be a value greater than or equal to zero.'
      )
    })

    test('debe fallar si el nuevo valor es mayor a 1', () => {
      expect(() => gamepadButton.setNoiseThreshold(1.1)).toThrowError(
        'noiseThreshold must be a value lower than or equal to one.'
      )
    })

    test('debe actualizar correctamente el valor si está entre 0 y 1', () => {
      gamepadButton.setNoiseThreshold(0)
      expect(gamepadButton.getNoiseThreshold()).toBe(0)

      gamepadButton.setNoiseThreshold(1)
      expect(gamepadButton.getNoiseThreshold()).toBe(1)
    })
  })

  describe('setInputDelta', () => {
    test('debe fallar si el nuevo valor es menor a 0', () => {
      expect(() => gamepadButton.setInputDelta(-0.1)).toThrowError(
        'inputDelta must be a value greater than or equal to zero.'
      )
    })

    test('debe fallar si el nuevo valor es mayor a 1', () => {
      expect(() => gamepadButton.setInputDelta(1.1)).toThrowError(
        'inputDelta must be a value lower than or equal to one.'
      )
    })

    test('debe actualizar correctamente el valor si está entre 0 y 1', () => {
      gamepadButton.setInputDelta(0)
      expect(gamepadButton.getInputDelta()).toBe(0)

      gamepadButton.setInputDelta(1)
      expect(gamepadButton.getInputDelta()).toBe(1)
    })
  })
})
