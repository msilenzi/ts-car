import { beforeEach, describe, expect, test } from 'vitest'
import DigitalButtonInput from '../DigitalButtonInput.ts'

describe('DigitalButtonInput', () => {
  let digitalButton: DigitalButtonInput

  beforeEach(() => {
    digitalButton = new DigitalButtonInput(0)
  })

  describe('constructor', () => {
    test('debe inicializar correctamente el índice', () => {
      expect(digitalButton.getIndex()).toBe(0)
    })

    test('debe inicializar el estado como 0', () => {
      expect(digitalButton.getStatus()).toBe(0)
    })
  })

  describe('updateStatus', () => {
    test('debe actualizar el estado si cambió', () => {
      const gpMock = { buttons: [{ pressed: true }] } as unknown as Gamepad
      expect(digitalButton.updateStatus(gpMock)).toBeTruthy()
      expect(digitalButton.getStatus()).toBe(1)
    })

    test('no debe actualizar el estado si no hubo cambios', () => {
      const gpMock = { buttons: [{ pressed: false }] } as unknown as Gamepad
      expect(digitalButton.updateStatus(gpMock)).toBeFalsy()
    })
  })

  describe('initialize', () => {
    test('debe poner el estado del botón en 0', () => {
      const gpMock = { buttons: [{ pressed: true }] } as unknown as Gamepad
      digitalButton.updateStatus(gpMock)
      digitalButton.initializeStatus()
      expect(digitalButton.getStatus()).toBe(0)
    })
  })
})
