import { beforeEach, describe, expect, test } from 'vitest'
import GamepadAnalogButton from '../GamepadAnalogButton.ts'

describe('GamepadAnalogButton', () => {
  const gamepadButtonIndex = 1
  let gamepadButton: GamepadAnalogButton
  let gamepadMock: Gamepad

  beforeEach(() => {
    gamepadButton = new GamepadAnalogButton(gamepadButtonIndex, {
      noiseThreshold: 0.25,
      inputDelta: 0.2,
    })
    gamepadMock = {
      buttons: [{ value: 0.2 }, { value: 0.3 }, { value: 0 }],
    } as unknown as Gamepad
  })

  describe('constructor', () => {
    test('debe inicializar correctamente el índice', () => {
      expect(gamepadButton.getIndex()).toBe(gamepadButtonIndex)
    })

    test('debe inicializar el estado como 0', () => {
      expect(gamepadButton.getStatus()).toBe(0)
    })

    test('debe inicializar correctamente las opciones', () => {
      expect(gamepadButton.getNoiseThreshold()).toBe(0.25)
      expect(gamepadButton.getInputDelta()).toBe(0.2)
    })

    test('debe inicializar las opciones con valores por defecto', () => {
      const btn = new GamepadAnalogButton(1)
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
    test('debe indicar si el estado del botón en el gamepad cambió', () => {
      expect(gamepadButton.hasBeenUpdated(gamepadMock)).toBeTruthy()
    })
  })

  describe('initialize', () => {
    test('debe poner el estado del botón en 0', () => {
      gamepadButton.updateStatus(gamepadMock)
      gamepadButton.initializeStatus()
      expect(gamepadButton.getStatus()).toBe(0)
    })
  })

  describe('setNoiseThreshold', () => {
    test('debe fallar si el nuevo valor es menor a 0', () => {
      expect(() => gamepadButton.setNoiseThreshold(-0.1)).toThrowError(
        'noiseThreshold should be a value greater than or equal to zero and less than or equal to one.'
      )
    })

    test('debe fallar si el nuevo valor es mayor a 1', () => {
      expect(() => gamepadButton.setNoiseThreshold(1.1)).toThrowError(
        'noiseThreshold should be a value greater than or equal to zero and less than or equal to one.'
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
        'inputDelta should be a value greater than or equal to zero and less than or equal to one.'
      )
    })

    test('debe fallar si el nuevo valor es mayor a 1', () => {
      expect(() => gamepadButton.setInputDelta(1.1)).toThrowError(
        'inputDelta should be a value greater than or equal to zero and less than or equal to one.'
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
