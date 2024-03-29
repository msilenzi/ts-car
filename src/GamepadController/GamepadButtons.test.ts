import {
  assertType,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  test,
} from 'vitest'
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

  let gamepadButtons: GamepadButtons<MockButtonsMapper>

  beforeEach(() => {
    gamepadButtons = new GamepadButtons(buttonMapper)
  })

  test('debe inicializarse correctamente', () => {
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
    expect(JSON.stringify(indexes)).toEqual(JSON.stringify(buttonMapper))
  })
})
