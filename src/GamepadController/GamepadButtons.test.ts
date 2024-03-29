import { describe, expect, expectTypeOf, test } from 'vitest'
import GamepadButtons from './GamepadButtons'

describe.concurrent('Pruebas para GamepadButtons', () => {
  type MockButtonsMapper = {
    buttonA: number
    buttonB: number
  }

  const buttonMapper: MockButtonsMapper = {
    buttonA: 0,
    buttonB: 2,
  }

  test('debe inicializarse correctamente', () => {
    const gamepadButtons = new GamepadButtons(buttonMapper)
    const status = gamepadButtons.getStatus()
    const indexes = gamepadButtons.getIndexes()

    // Verifica que los tipos se definan correctamente
    // Mas info: https://vitest.dev/guide/testing-types.html#testing-types
    expectTypeOf(status).toMatchTypeOf<MockButtonsMapper>()
    expectTypeOf(indexes).toMatchTypeOf<MockButtonsMapper>()

    // Verifica que el estado se inicialice correctamente
    Object.values(status).forEach((value) => {
      expectTypeOf(value).toMatchTypeOf<number>()
      expect(value).toBe(0)
    })

    // Verifica que los índices se asignen correctamente
    expect(indexes).toStrictEqual(buttonMapper)
  })

  describe.concurrent('pruebas sobre el método updateStatus', () => {
    test('debe actualizar el estado correctamente', () => {
      const gamepadButtons = new GamepadButtons(buttonMapper)

      // Solo importa el campo `value`, el resto de campos están por
      // compatibilidad de tipos con la interfaz de GamepadButton.
      const mockButtons: GamepadButton[] = [
        { pressed: true, touched: true, value: 0 }, // buttonA
        { pressed: true, touched: true, value: 1 }, // no se usa
        { pressed: true, touched: true, value: 1 }, // buttonB
      ]

      const updatedStatus = gamepadButtons.updateStatus(mockButtons)

      expect(updatedStatus).toStrictEqual({ buttonB: 1 })
      expect(gamepadButtons.getStatus()).toStrictEqual({
        buttonA: 0,
        buttonB: 1,
      })
    })

    test('solo debe actualizar el estado de los botones que están por encima del umbral de ruido', () => {
      const gamepadButtons = new GamepadButtons(buttonMapper)
      const mockValue = gamepadButtons.getNoiseThreshold() * 0.5
      const mockButtons: GamepadButton[] = [
        { pressed: true, touched: true, value: mockValue }, // buttonA
        { pressed: true, touched: true, value: 0 }, // no se usa
        { pressed: true, touched: true, value: 1 }, // buttonB
      ]

      const updatedStatus = gamepadButtons.updateStatus(mockButtons)

      expect(updatedStatus).toStrictEqual({ buttonB: 1 })
      expect(gamepadButtons.getStatus()).toStrictEqual({
        buttonA: 0,
        buttonB: 1,
      })
    })

    test('solo debe actualizar el estado de los botones que cambiaron por encima del delta', () => {
      const gamepadButtons = new GamepadButtons(buttonMapper)
      gamepadButtons.updateStatus([
        { pressed: true, touched: true, value: 0.5 }, // buttonA
        { pressed: true, touched: true, value: 0 }, // no se usa
        { pressed: true, touched: true, value: 0.5 }, // buttonB
      ])

      const updatedStatus = gamepadButtons.updateStatus([
        {
          pressed: true,
          touched: true,
          value: 0.5 + gamepadButtons.getInputDelta() * 0.5, // Debajo del delta
        }, // buttonA
        { pressed: true, touched: true, value: 0 }, // no se usa
        {
          pressed: true,
          touched: true,
          value: 0.5 + gamepadButtons.getInputDelta() * 1.5, // Sobre el delta
        }, // buttonB
      ])

      expect(updatedStatus).toStrictEqual({
        buttonB: 0.5 + gamepadButtons.getInputDelta() * 1.5,
      })

      expect(gamepadButtons.getStatus()).toStrictEqual({
        buttonA: 0.5,
        buttonB: 0.5 + gamepadButtons.getInputDelta() * 1.5,
      })
    })

    test('debe actualizar el estado de los botones que quedaron debajo del umbral de ruido y delta', () => {
      const gamepadButtons = new GamepadButtons(buttonMapper)

      // buttonA y buttonB se presionan. buttonB se presiona apenas sobre el
      // límite de ruido:

      const initialMockValueB =
        gamepadButtons.getNoiseThreshold() +
        gamepadButtons.getInputDelta() * 0.2

      gamepadButtons.updateStatus([
        { pressed: true, touched: true, value: 0.5 }, // buttonA
        { pressed: true, touched: true, value: 0 }, // no se usa
        { pressed: true, touched: true, value: initialMockValueB }, // buttonB
      ])

      // buttonA se suelta completamente superando el delta y buttonB se suelta
      // ligeramente, de forma que queda por debajo del umbral de ruido pero
      // no supera el delta, por lo que no se actualiza su estado:

      const updatedMockValueB1 =
        gamepadButtons.getNoiseThreshold() -
        gamepadButtons.getInputDelta() * 0.2

      expect(
        gamepadButtons.updateStatus([
          { pressed: true, touched: true, value: 0 }, // buttonA
          { pressed: true, touched: true, value: 0 }, // no se usa
          { pressed: true, touched: true, value: updatedMockValueB1 }, // buttonB
        ])
      ).toStrictEqual({
        buttonA: 0,
      })

      // Se suelta un poco más a buttonB de forma que queda por debajo del
      // umbral de ruido y supera al delta. Se actualiza su estado:

      const updatedMockValueB2 =
        gamepadButtons.getNoiseThreshold() - gamepadButtons.getInputDelta()
      expect(
        gamepadButtons.updateStatus([
          { pressed: true, touched: true, value: 0 }, // buttonA
          { pressed: true, touched: true, value: 0 }, // no se usa
          { pressed: true, touched: true, value: updatedMockValueB2 }, // buttonB
        ])
      ).toStrictEqual({ buttonB: 0 })
    })
  })

  test('debe actualizar el valor de noiseThreshold correctamente', () => {
    const gamepadButtons = new GamepadButtons(buttonMapper)
    
    gamepadButtons.setNoiseThreshold(0.5)

    expect(() => {
      gamepadButtons.setNoiseThreshold(-0.5);
    }).toThrowError('noiseThreshold should be a value greater than zero and less than one.');
  
    expect(() => {
      gamepadButtons.setNoiseThreshold(1.5);
    }).toThrowError('noiseThreshold should be a value greater than zero and less than one.');

    expect(gamepadButtons.getNoiseThreshold()).toBe(0.5)
  })

  test('debe actualizar el valor de inputDelta correctamente', () => {
    const gamepadButtons = new GamepadButtons(buttonMapper)
    
    gamepadButtons.setInputDelta(0.5)

    expect(() => {
      gamepadButtons.setInputDelta(-0.5);
    }).toThrowError('inputDelta should be a value greater than zero and less than one.');
  
    expect(() => {
      gamepadButtons.setInputDelta(1.5);
    }).toThrowError('inputDelta should be a value greater than zero and less than one.');

    expect(gamepadButtons.getInputDelta()).toBe(0.5)
  })
})
