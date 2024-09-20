import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest'
import GamepadButtons from '../GamepadButtons.ts'

describe('Pruebas para GamepadButtons', () => {
  type MockButtonsMapper = {
    buttonA: number
    buttonB: number
  }

  const buttonMapper: MockButtonsMapper = {
    buttonA: 0,
    buttonB: 2,
  }

  let gpButtons: GamepadButtons<MockButtonsMapper>

  beforeEach(() => {
    gpButtons = new GamepadButtons(buttonMapper)
  })

  describe('constructor', () => {
    test('debe inicializarse y asignar los índices correctamente', () => {
      const status = gpButtons.getStatus()
      const indexes = gpButtons.getIndexes()

      // Verifica que los tipos se definan correctamente
      // Más info: https://vitest.dev/guide/testing-types.html#testing-types
      expectTypeOf(status).toMatchTypeOf<MockButtonsMapper>()
      expectTypeOf(indexes).toMatchTypeOf<MockButtonsMapper>()

      // Verifica que el estado se inicialice correctamente
      expect(status).toStrictEqual({ buttonA: 0, buttonB: 0 })

      // Verifica que los índices se asignen correctamente
      expect(indexes).toStrictEqual(buttonMapper)
    })
  })

  describe('updateStatus', () => {
    test('debe actualizar el estado correctamente', () => {
      const mockButtons: number[] = [0, 1, 1] // [buttonA, no se usa, buttonB]
      gpButtons.updateStatus(mockButtons)
      expect(gpButtons.getStatus()).toStrictEqual({
        buttonA: 0,
        buttonB: 1,
      })
    })

    test('debe devolver los valores que cambiaron', () => {
      const mockButtons: number[] = [0, 1, 1] // [buttonA, no se usa, buttonB]
      const updatedStatus = gpButtons.updateStatus(mockButtons)
      expect(updatedStatus).toStrictEqual({ buttonB: 1 })
    })

    test('solo debe actualizar el estado de los botones que están por encima del umbral de ruido', () => {
      const mockValue = gpButtons.getNoiseThreshold() * 0.5
      gpButtons.updateStatus([mockValue, 0, 1]) // [buttonA, _, buttonB]
      expect(gpButtons.getStatus()).toStrictEqual({
        buttonA: 0, // No actualiza el estado de A por ser menor al umbral
        buttonB: 1, // Actualiza el estado de B por ser mayor al umbral
      })
    })

    test('solo debe actualizar el estado de los botones que cambiaron por encima del delta', () => {
      gpButtons.updateStatus([0.5, 0, 0.5]) // [buttonA, _, buttonB]
      gpButtons.updateStatus([
        0.5 + gpButtons.getInputDelta() * 0.5, // buttonA - Debajo del delta
        0, // no se usa
        0.5 + gpButtons.getInputDelta() * 1.5, // buttonB - Sobre el delta
      ])
      expect(gpButtons.getStatus()).toStrictEqual({
        buttonA: 0.5,
        buttonB: 0.5 + gpButtons.getInputDelta() * 1.5,
      })
    })

    test('debe actualizar el estado de los botones que quedaron debajo del umbral de ruido y delta', () => {
      // buttonA y buttonB se presionan.
      // buttonB se presiona apenas sobre el umbral de ruido:
      const initialValueB =
        gpButtons.getNoiseThreshold() + gpButtons.getInputDelta() * 0.2
      gpButtons.updateStatus([0.5, 0, initialValueB])

      // buttonA se suelta completamente superando el delta y buttonB se suelta
      // ligeramente, de forma que queda por debajo del umbral de ruido, pero
      // no supera el delta, por lo que no se actualiza su estado:
      const updatedValueB1 =
        gpButtons.getNoiseThreshold() - gpButtons.getInputDelta() * 0.2
      const updatedStatus1 = gpButtons.updateStatus([0, 0, updatedValueB1])
      expect(updatedStatus1).toStrictEqual({ buttonA: 0 })

      // Se suelta un poco más a buttonB de forma que queda por debajo del
      // umbral de ruido y supera al delta. Se actualiza su estado:
      const updatedValueB2 =
        gpButtons.getNoiseThreshold() - gpButtons.getInputDelta()
      const updatedStatus2 = gpButtons.updateStatus([0, 0, updatedValueB2])
      expect(updatedStatus2).toStrictEqual({ buttonB: 0 })
    })
  })

  describe('stop', () => {
    test('debe establecer los valores iniciales correctamente', () => {
      gpButtons.updateStatus([1, 1, 1]) // [buttonA, _, button B]

      // Detener el control
      gpButtons.stop()

      // Verificar que se reinicializaron correctamente
      expect(gpButtons.getStatus()).toStrictEqual({
        buttonA: 0,
        buttonB: 0,
      })
    })
  })

  describe('setNoiseThreshold', () => {
    test('debe actualizar el valor de noiseThreshold correctamente', () => {
      const errorMsg =
        'noiseThreshold should be a value greater than or equal to zero and less than or equal to one.'

      // Actualiza el umbral de ruido correctamente
      gpButtons.setNoiseThreshold(0.5)

      // Falla y tira un error por ser un valor inválido
      expect(() => gpButtons.setNoiseThreshold(-0.5)).toThrowError(errorMsg)
      expect(() => gpButtons.setNoiseThreshold(1.5)).toThrowError(errorMsg)

      // Permanece el valor de la última modificación correcta
      expect(gpButtons.getNoiseThreshold()).toBe(0.5)
    })
  })

  describe('setInputDelta', () => {
    test('debe actualizar el valor de inputDelta correctamente', () => {
      const errorMsg =
        'inputDelta should be a value greater than or equal to zero and less than or equal to one.'

      // Actualiza el delta correctamente
      gpButtons.setInputDelta(0.5)

      // Falla y tira un error por ser un valor inválido
      expect(() => gpButtons.setInputDelta(-0.5)).toThrowError(errorMsg)
      expect(() => gpButtons.setInputDelta(1.5)).toThrowError(errorMsg)

      // Permanece el valor de la última modificación correcta
      expect(gpButtons.getInputDelta()).toBe(0.5)
    })
  })
})
