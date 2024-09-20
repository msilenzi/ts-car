import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest'
import GamepadAxes from '../GamepadAxes.ts'

describe('Pruebas para GamepadAxes', () => {
  type MockAxesMapper = {
    axesA: { x: number; y: number }
    axisB: { x: number }
    axisC: { y: number }
  }

  const axesMapper: MockAxesMapper = {
    axesA: { x: 0, y: 1 },
    axisB: { x: 2 },
    axisC: { y: 3 },
  }

  let gpAxes: GamepadAxes<MockAxesMapper>

  beforeEach(() => {
    gpAxes = new GamepadAxes(axesMapper)
  })

  describe('constructor', () => {
    test('debe inicializarse y asignar los índices correctamente', () => {
      const status = gpAxes.getStatus()
      const indexes = gpAxes.getIndexes()

      expectTypeOf(status).toMatchTypeOf<MockAxesMapper>()
      expectTypeOf(indexes).toMatchTypeOf<MockAxesMapper>()
      expect(status).toStrictEqual({
        axesA: { x: 0, y: 0 },
        axisB: { x: 0, y: 0 },
        axisC: { x: 0, y: 0 },
      })
      expect(indexes).toStrictEqual(axesMapper)
    })
  })
})
