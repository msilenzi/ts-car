import { beforeEach, describe, expect, test } from 'vitest'
import AnalogButtonInput from '../AnalogButtonInput.ts'

describe('AnalogButtonInput', () => {
  const gamepadButtonIndex = 1
  let analogButton: AnalogButtonInput
  let gamepadMock: Gamepad

  beforeEach(() => {
    analogButton = new AnalogButtonInput(gamepadButtonIndex, {
      noiseThreshold: 0.25,
      inputDelta: 0.2,
    })
    gamepadMock = {
      buttons: [{ value: 0.2 }, { value: 0.3 }, { value: 0 }],
    } as unknown as Gamepad
  })

  describe('constructor', () => {
    test('debe inicializar correctamente las opciones', () => {
      expect(analogButton.getNoiseThreshold()).toBe(0.25)
      expect(analogButton.getInputDelta()).toBe(0.2)
    })

    test('debe inicializar las opciones con valores por defecto', () => {
      const btn = new AnalogButtonInput(1)
      expect(btn.getNoiseThreshold()).toBe(0.15)
      expect(btn.getInputDelta()).toBe(0.1)
    })
  })

  describe('updateStatus', () => {
    test('debe actualizar correctamente el estado', () => {
      expect(analogButton.updateStatus(gamepadMock)).toBe(0.3)
      expect(analogButton.getStatus()).toBe(0.3)
    })
  })

  describe('hasBeenUpdated', () => {
    test('Debe devolver false si ya estaba siendo accionada la entrada y el delta es menor', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.5 }],
      } as unknown as Gamepad
      analogButton.updateStatus(gamepadMock) // Accionar la entrada
      expect(analogButton.hasBeenUpdated(gpMock)).toBeFalsy()
    })

    test('Debe devolver true si ya estaba siendo accionada la entrada y el delta es mayor', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.51 }],
      } as unknown as Gamepad
      analogButton.updateStatus(gamepadMock) // Accionar la entrada
      expect(analogButton.hasBeenUpdated(gpMock)).toBeTruthy()
    })

    test('Debe devolver false si no estaba siendo accionada la entrada y está por debajo del umbral de ruido', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.25 }],
      } as unknown as Gamepad
      expect(analogButton.hasBeenUpdated(gpMock)).toBeFalsy()
    })

    test('Debe devolver true si no estaba siendo accionada la entrada y está por encima del umbral de ruido', () => {
      const gpMock = {
        buttons: [{ value: 0 }, { value: 0.26 }],
      } as unknown as Gamepad
      expect(analogButton.hasBeenUpdated(gpMock)).toBeTruthy()
    })
  })

  describe('setNoiseThreshold', () => {
    test('debe fallar si el nuevo valor es menor a 0', () => {
      expect(() => analogButton.setNoiseThreshold(-0.1)).toThrowError(
        'noiseThreshold must be a value greater than or equal to zero.'
      )
    })

    test('debe fallar si el nuevo valor es mayor a 1', () => {
      expect(() => analogButton.setNoiseThreshold(1.1)).toThrowError(
        'noiseThreshold must be a value lower than or equal to one.'
      )
    })

    test('debe actualizar correctamente el valor si está entre 0 y 1', () => {
      analogButton.setNoiseThreshold(0)
      expect(analogButton.getNoiseThreshold()).toBe(0)

      analogButton.setNoiseThreshold(1)
      expect(analogButton.getNoiseThreshold()).toBe(1)
    })
  })

  describe('setInputDelta', () => {
    test('debe fallar si el nuevo valor es menor a 0', () => {
      expect(() => analogButton.setInputDelta(-0.1)).toThrowError(
        'inputDelta must be a value greater than or equal to zero.'
      )
    })

    test('debe fallar si el nuevo valor es mayor a 1', () => {
      expect(() => analogButton.setInputDelta(1.1)).toThrowError(
        'inputDelta must be a value lower than or equal to one.'
      )
    })

    test('debe actualizar correctamente el valor si está entre 0 y 1', () => {
      analogButton.setInputDelta(0)
      expect(analogButton.getInputDelta()).toBe(0)

      analogButton.setInputDelta(1)
      expect(analogButton.getInputDelta()).toBe(1)
    })
  })
})
