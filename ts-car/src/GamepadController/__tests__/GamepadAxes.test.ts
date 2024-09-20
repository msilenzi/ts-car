import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest'
import GamepadAxes from '../GamepadAxes.ts'

describe('Pruebas para GamepadAxes', () => {
  type MockAxesMapper = {
    axesA: { x: number; y: number }
    axesB: { x: number }
    axesC: { y: number }
  }

  const axesMapper: MockAxesMapper = {
    axesA: { x: 0, y: 1 },
    axesB: { x: 2 },
    axesC: { y: 3 },
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
        axesB: { x: 0, y: 0 },
        axesC: { x: 0, y: 0 },
      })
      expect(indexes).toStrictEqual(axesMapper)
    })
  })

  describe('updateStatus', () => {
    test('debe actualizar el estado correctamente', () => {
      gpAxes.updateStatus([0.1, 0.2, 0.3, 0.4])
      expect(gpAxes.getStatus()).toStrictEqual({
        axesA: { x: 0.1, y: 0.2 },
        axesB: { x: 0.3, y: 0 },
        axesC: { x: 0, y: 0.4 },
      })
    })

    test('debe devolver los valores que cambiaron', () => {
      const updatedStatatus = gpAxes.updateStatus([0, 1, 1, 0])
      expect(updatedStatatus).toStrictEqual({
        axesA: { x: 0, y: 1 },
        axesB: { x: 1, y: 0 },
      })
    })

    test('solo debe actualizar el estado de los ejes que están por encima del umbral de ruido', () => {
      const nt = gpAxes.getNoiseThreshold()
      const updatedStatus = gpAxes.updateStatus([nt * 0.5, 0, 0, nt * 1.5])
      expect(updatedStatus).toStrictEqual({ axesC: { x: 0, y: nt * 1.5 } })
    })

    test('solo debe actualizar el estado de los ejes que cambiaron por encima del delta', () => {
      gpAxes.updateStatus([0.5, 0.5, 0.5, 0.5])
      const updatedStatus = gpAxes.updateStatus([
        0.5 + gpAxes.getInputDelta() * 0.1, // axesA.x - debajo del delta
        0.5 + gpAxes.getInputDelta() * 1.5, // axesA.y - encima del delta
        0.5 + gpAxes.getInputDelta() * 0.1, // axesB.x - debajo del delta
        0.5 + gpAxes.getInputDelta() * 1.5, // axesC.y - encima del delta
      ])
      expect(updatedStatus).toStrictEqual({
        axesA: {
          x: 0.5 + gpAxes.getInputDelta() * 0.1,
          y: 0.5 + gpAxes.getInputDelta() * 1.5,
        },
        axesC: {
          x: 0,
          y: 0.5 + gpAxes.getInputDelta() * 1.5,
        },
      })
    })

    test('solo debe actualizar el estado de los ejes que quedaron por debajo del umbral de ruido y delta', () => {
      const nt = gpAxes.getNoiseThreshold()
      const id = gpAxes.getInputDelta()

      // axesA y axesB se presionan.
      // axesB se presiona apenas sobre el umbral de ruido:
      gpAxes.updateStatus([1, 0, nt + id * 0.2, 0])

      // axesA se suelta completamente superando el delta y axesB se suelta
      // ligeramente, de forma que queda de debajo del umbral de ruido, pero
      // no supera el delta, por lo que no se actualiza su estado
      const updatedStatusB1 = gpAxes.updateStatus([0, 0, nt - id * 0.1, 0])
      expect(updatedStatusB1).toStrictEqual({ axesA: { x: 0, y: 0 } })

      // Se suelta un poco más axesB, de forma que queda de debajo del
      // umbral de ruido y supera el delta. Se actualiza su estado:
      const updatedStatusB2 = gpAxes.updateStatus([0, 0, nt - id, 0])
      expect(updatedStatusB2).toStrictEqual({ axesB: { x: 0, y: 0 } })
    })
  })
})
