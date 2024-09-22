import { beforeEach, describe, expect, test } from 'vitest'
import SingleAxisInput from '../SingleAxisInput.ts'

describe('SingleAxisInput', () => {
  let singleAxis: SingleAxisInput
  let gamepadMock: Gamepad

  beforeEach(() => {
    singleAxis = new SingleAxisInput(0)
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
