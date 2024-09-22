import { beforeEach, describe, expect, test } from 'vitest'
import DigitalButtonInput from '../DigitalButtonInput.ts'

describe('DigitalButtonInput', () => {
  const gamepadButtonIndex = 1
  let digitalButton: DigitalButtonInput
  let gamepadMock: Gamepad

  beforeEach(() => {
    digitalButton = new DigitalButtonInput(gamepadButtonIndex)
    gamepadMock = {
      buttons: [{ pressed: true }, { pressed: true }, { pressed: false }],
    } as unknown as Gamepad
  })

  describe('constructor', () => {
    test('debe inicializar correctamente el índice', () => {
      expect(digitalButton.getIndex()).toBe(gamepadButtonIndex)
    })

    test('debe inicializar el estado como 0', () => {
      expect(digitalButton.getStatus()).toBe(0)
    })
  })

  describe('updateStatus', () => {
    test('debe actualizar correctamente el estado', () => {
      expect(digitalButton.updateStatus(gamepadMock)).toBe(1)
      expect(digitalButton.getStatus()).toBe(1)
    })
  })

  describe('hasBeenUpdated', () => {
    test('debe indicar si el estado del botón en el gamepad cambió', () => {
      expect(digitalButton.hasBeenUpdated(gamepadMock)).toBeTruthy()
    })
  })

  describe('initialize', () => {
    test('debe poner el estado del botón en 0', () => {
      digitalButton.updateStatus(gamepadMock)
      digitalButton.initializeStatus()
      expect(digitalButton.getStatus()).toBe(0)
    })
  })
})
