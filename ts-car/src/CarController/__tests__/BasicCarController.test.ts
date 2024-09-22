import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest'
import BasicCarController from '../BasicCarController.ts'
import { createWheelCarMapper } from '../mappers.ts'

describe('BasicCarController', () => {
  //
  // Mocks

  vi.mock('../../ui/latency.ts', () => ({
    setLatency: vi.fn(() => {}),
  }))

  vi.mock('../../ui/controllerStatus.ts', () => ({
    setControllerStatus: vi.fn(() => {}),
  }))

  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    statusText: 'OK',
    json: async () => {}, // Devuelve una promesa vacía
  } as Response)

  //
  // CarController

  const CAR_URL = 'test.com'
  let controller: BasicCarController
  const wheelCarMapper = createWheelCarMapper()

  //
  // Set up

  beforeEach(() => {
    // Generar un nuevo control antes de cada prueba para evitar side-effects
    controller = new BasicCarController(0, createWheelCarMapper(), CAR_URL)

    // Mock para `getGamepads` si no está definido
    if (!navigator.getGamepads) {
      Object.defineProperty(navigator, 'getGamepads', {
        value: vi.fn(() => []),
        configurable: true,
      })
    }

    // Limpiar el estado de los mocks antes de cada prueba
    vi.clearAllMocks()

    // Usar timers falsos que pueden ser manipulados
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restaurar timers
    vi.useRealTimers()
  })

  //
  // Tests

  describe('start', () => {
    test('debe iniciar el intervalo', () => {
      const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')

      controller.start()
      expect(setIntervalSpy).toHaveBeenCalledOnce()
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 50)

      setIntervalSpy.mockRestore()
    })

    test('solo debe actualizar el estado del control si tiene modificaciones', () => {
      //
      // Set up

      const handleStatusUpdatedSpy = vi.spyOn(controller, 'handleStatusUpdated')

      // Crear un mock de gamepad con todos valores en 0.
      // El tamaño del arreglo es arbitrario, pero debe ser mayor al mayor
      // índice en el mapper.
      const gamepadMock = {
        buttons: Array.from({ length: 6 }, () => ({ pressed: false })),
        axes: Array.from({ length: 4 }, () => 0),
      }

      vi.spyOn(navigator, 'getGamepads').mockReturnValue([
        gamepadMock,
      ] as unknown as (Gamepad | null)[])

      //
      // Test

      controller.start()

      // Cambiar el estado de algunos valores:
      // - adelante se debe considerar
      // - dirección NO se debe considerar por estar por debajo del umbral de ruido
      gamepadMock.buttons[wheelCarMapper.adelante.getIndex()].pressed = true
      gamepadMock.axes[wheelCarMapper.direccion.getIndex()] = 0.1

      // Simular la ejecución de un intervalo
      // Verificar que reciba correctamente el estado
      vi.advanceTimersToNextTimer()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledOnce()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledWith({ adelante: 1 })

      // Pasar al siguiente intervalo
      // Verificar que no actualice el estado
      vi.advanceTimersToNextTimer()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledOnce()

      // Pasar al siguiente intervalo
      // Verificar que actualice el intervalo correctamente
      gamepadMock.buttons[wheelCarMapper.adelante.getIndex()].pressed = false
      vi.advanceTimersToNextTimer()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledTimes(2)
      expect(handleStatusUpdatedSpy).toHaveBeenCalledWith({ adelante: 0 })

      handleStatusUpdatedSpy.mockRestore()
    })

    test('debe lanzar un error si ya está iniciado', () => {
      const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
      controller.start()

      // Al iniciar cuando ya está iniciado lanza un error
      expect(() => controller.start()).toThrowError(
        'Gamepad polling already started'
      )
      expect(setIntervalSpy).toHaveBeenCalledOnce()

      // Al detener y volver a iniciar el control debe volver a ejecutarse
      controller.stop()
      controller.start()

      expect(setIntervalSpy).toHaveBeenCalledTimes(2)

      setIntervalSpy.mockRestore()
    })
  })

  describe('stop', () => {
    test('debe limpiar el intervalo', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

      controller.start()
      controller.stop()

      expect(clearIntervalSpy).toHaveBeenCalledOnce()
      clearIntervalSpy.mockRestore()
    })

    test('debe restablecer el estado del control', () => {
      const handleStatusUpdatedSpy = vi.spyOn(controller, 'handleStatusUpdated')

      controller.start()
      controller.stop()

      expect(handleStatusUpdatedSpy).toHaveBeenCalledWith({
        adelante: 0,
        atras: 0,
        direccion: 0,
      })
    })

    test('debe lanzar un error si ya está detenido', () => {
      expect(() => controller.stop()).toThrowError(
        'Gamepad polling already stopped'
      )
    })
  })

  describe('getStatus', () => {
    test('debe devolver el estado del control', () => {
      expect(controller.getStatus()).toStrictEqual({
        adelante: 0,
        atras: 0,
        direccion: 0,
      })
    })
  })

  describe('handleStatusUpdated', () => {
    let statusMock: ReturnType<BasicCarController['getStatus']>

    beforeEach(() => {
      // Esto permite que al modificar los valores de `statusMock` y después
      // invocar a `controller.handleStatusUpdated()` se tomen los valores
      // como el nuevo estado
      statusMock = { adelante: 0, atras: 0, direccion: 0 }
      vi.spyOn(controller, 'getStatus').mockReturnValue(statusMock)
    })

    test('debe enviar una instrucción "adelante" si se presiona el botón adelante', () => {
      statusMock.adelante = 1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/adelante`)
    })

    test('debe enviar una instrucción "atrás" si se presiona el botón atrás', () => {
      statusMock.atras = 1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/atras`)
    })

    test('debe enviar una instrucción "izquierda" si se mueve el stick a la izquierda', () => {
      statusMock.direccion = -1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/izquierda`)
    })

    test('debe enviar una instrucción "derecha" si se mueve el stick a la derecha', () => {
      statusMock.direccion = 1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/derecha`)
    })

    test('debe enviar una instrucción "parar" si se dejaron de presionar todos los botones', () => {
      statusMock.adelante = 1
      controller.handleStatusUpdated()

      statusMock.adelante = 0
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(fetchMock).toHaveBeenNthCalledWith(1, `${CAR_URL}/adelante`)
      expect(fetchMock).toHaveBeenNthCalledWith(2, `${CAR_URL}/parar`)
    })

    test('no debe enviar ninguna instrucción si es la misma instrucción que la última enviada', () => {
      statusMock.adelante = 1

      controller.handleStatusUpdated()
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/adelante`)
    })
  })
})
