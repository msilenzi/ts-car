import { beforeEach, describe, expect, test } from 'vitest'
import GamepadDigitalButton from '../GamepadDigitalButton.ts'

describe('GamepadDigitalButton', () => {
  const gamepadButtonIndex = 1
  let gamepadButton: GamepadDigitalButton
  let gamepadMock: Gamepad

  beforeEach(() => {
    gamepadButton = new GamepadDigitalButton(gamepadButtonIndex)
    gamepadMock = {
      buttons: [{ pressed: true }, { pressed: true }, { pressed: false }],
    } as unknown as Gamepad
  })

  describe('constructor', () => {
    test('debe inicializar correctamente el índice', () => {
      expect(gamepadButton.getIndex()).toBe(gamepadButtonIndex)
    })

    test('debe inicializar el estado como 0', () => {
      expect(gamepadButton.getStatus()).toBe(0)
    })
  })

  describe('updateStatus', () => {
    test('debe actualizar correctamente el estado', () => {
      expect(gamepadButton.updateStatus(gamepadMock)).toBe(1)
      expect(gamepadButton.getStatus()).toBe(1)
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
})
