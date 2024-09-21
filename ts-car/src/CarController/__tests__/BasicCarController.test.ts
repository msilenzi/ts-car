import { beforeEach, describe, expect, test, vi } from 'vitest'
import BasicCarController from '../BasicCarController.ts'
import { CarMapper } from '../AbstractCarController.ts'

describe('BasicCarController', () => {
  //
  // Mocks

  vi.mock('../../ui/latency.ts', () => ({
    setLatency: vi.fn(() => {}),
  }))

  vi.mock('../../ui/controllerStatus.ts', () => ({
    setStatus: vi.fn(() => {}),
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

  //
  // Set up

  beforeEach(() => {
    // Generar un nuevo control antes de cada prueba para evitar side-effects
    const mapper: CarMapper = {
      buttons: { adelante: 0, atras: 1 },
      axes: { direccion: { x: 0 } },
    }
    controller = new BasicCarController(0, mapper, CAR_URL)

    // Limpiar el estado de los mocks antes de cada prueba
    vi.clearAllMocks()
    fetchMock.mockClear()
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

      const gamepadMock = {
        buttons: [{ value: 0.5 }, { value: 0 }],
        axes: [0.1, -0.2],
      }

      if (!navigator.getGamepads) {
        // Mock para `getGamepads` si no está definido en vitest
        Object.defineProperty(navigator, 'getGamepads', {
          value: vi.fn(() => [gamepadMock]),
          configurable: true,
        })
      }

      // Hacer que getGamepads devuelva el valor de gamepadMock (se puede mutar)
      vi.spyOn(navigator, 'getGamepads').mockReturnValue([
        gamepadMock as unknown as Gamepad,
      ])

      // Permitir el control de los timers
      vi.useFakeTimers()

      //
      // Test

      // Iniciar el control
      controller.start()

      // Simular la ejecución del intervalo
      // Verificar que reciba correctamente el estado
      vi.advanceTimersToNextTimer()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledOnce()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledWith({
        buttons: { adelante: 0.5 },
        axes: {},
      })

      // Pasar al siguiente intervalo
      // Verificar que no actualize el estado
      vi.advanceTimersToNextTimer()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledOnce()

      // Pasar al siguiente intervalo
      gamepadMock.buttons[0].value = 0
      vi.advanceTimersToNextTimer()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledTimes(2)
      expect(handleStatusUpdatedSpy).toHaveBeenCalledWith({
        buttons: { adelante: 0 },
        axes: {},
      })

      handleStatusUpdatedSpy.mockRestore()
    })

    test('debe lanzar un error si ya está iniciado', () => {
      const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
      controller.start()

      // Al iniciar cuando ya está iniciado lanza un error
      expect(() => controller.start()).toThrowError('Gamepad already started')
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
      const buttonsStopSpy = vi.spyOn(controller['buttons'], 'stop')
      const axesStopSpy = vi.spyOn(controller['axes'], 'stop')
      const handleStatusUpdatedSpy = vi.spyOn(controller, 'handleStatusUpdated')

      controller.start()
      controller.stop()

      expect(buttonsStopSpy).toHaveBeenCalledOnce()
      expect(axesStopSpy).toHaveBeenCalledOnce()
      expect(handleStatusUpdatedSpy).toHaveBeenCalledWith({
        buttons: { adelante: 0, atras: 0 },
        axes: { direccion: { x: 0, y: 0 } },
      })

      buttonsStopSpy.mockRestore()
      axesStopSpy.mockRestore()
    })

    test('debe lanzar un error si ya está detenido', () => {
      expect(() => controller.stop()).toThrowError('Gamepad already stopped')
    })
  })

  describe('getStatus', () => {
    test('debe devolver el estado del control', () => {
      expect(controller.getStatus()).toStrictEqual({
        buttons: { adelante: 0, atras: 0 },
        axes: { direccion: { x: 0, y: 0 } },
      })
    })
  })

  describe('handleStatusUpdated', () => {
    let statusMock: CarMapper

    beforeEach(() => {
      // Esto permite que al modificar los valores de `statusMock` y después
      // invocar a `controller.handleStatusUpdated()` se tomen los valores
      // como el nuevo estado
      statusMock = {
        buttons: { adelante: 0, atras: 0 },
        axes: { direccion: { x: 0 } },
      }
      vi.spyOn(controller, 'getStatus').mockReturnValue(statusMock)
    })

    test('debe enviar una instrucción "adelante" si se presiona el botón adelante', () => {
      // Simular actualización en el estado del gamepad
      statusMock.buttons.adelante = 1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/adelante`)
    })

    test('debe enviar una instrucción "atrás" si se presiona el botón atrás', () => {
      // Simular actualización en el estado del gamepad
      statusMock.buttons.atras = 1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/atras`)
    })

    test('debe enviar una instrucción "izquierda" si se mueve el stick a la izquierda', () => {
      // Simular actualización en el estado del gamepad
      statusMock.axes.direccion.x = -1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/izquierda`)
    })

    test('debe enviar una instrucción "derecha" si se si se mueve el stick a la derecha', () => {
      // Simular actualización en el estado del gamepad
      statusMock.axes.direccion.x = 1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/derecha`)
    })

    test('debe enviar una instrucción "parar" si se dejaron de presionar todos los botones', () => {
      // Simular que se presionó el botón para mover hacia adelante
      statusMock.buttons.adelante = 1
      controller.handleStatusUpdated()

      // Simular que se dejó de presionar el botón para mover hacia adelante
      statusMock.buttons.adelante = 0
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(fetchMock).toHaveBeenNthCalledWith(1, `${CAR_URL}/adelante`)
      expect(fetchMock).toHaveBeenNthCalledWith(2, `${CAR_URL}/parar`)
    })

    test('no debe enviar ninguna instrucción si es la misma instrucción que la última enviada', () => {
      // Simular estado del gamepad
      statusMock.buttons.adelante = 1

      controller.handleStatusUpdated()
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/adelante`)
    })
  })
})
