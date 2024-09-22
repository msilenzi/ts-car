import { beforeEach, describe, expect, test } from 'vitest'
import GamepadSingleAxis from '../GamepadSingleAxis.ts'

describe('GamepadSingleAxis', () => {
  let singleAxis: GamepadSingleAxis
  let gamepadMock: Gamepad

  beforeEach(() => {
    singleAxis = new GamepadSingleAxis(0)
    gamepadMock = {
      axes: [0.2],
    } as unknown as Gamepad
  })

  describe('updateStatus', () => {
    test('Debe actualizar el estado correctamente', () => {
      expect(singleAxis.updateStatus(gamepadMock)).toBe(0.2)
    })
  })
})
