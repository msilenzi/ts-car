import { beforeEach, describe, expect, test } from 'vitest'
import SingleAxisInput from '../SingleAxisInput.ts'

describe('SingleAxisInput', () => {
  let singleAxis: SingleAxisInput
  const gamepadMock = { axes: [0.2] } as unknown as Gamepad

  beforeEach(() => {
    singleAxis = new SingleAxisInput(0)
  })

  describe('updateStatus', () => {
    test('Debe actualizar el estado correctamente', () => {
      expect(singleAxis.updateStatus(gamepadMock)).toBe(true)
      expect(singleAxis.getStatus()).toBe(0.2)
    })
  })
})
