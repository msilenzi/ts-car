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
      buttons: { adelante: 1, atras: 0 },
      axes: { direccion: { x: 0 } },
    }
    controller = new BasicCarController(0, mapper, CAR_URL)

    // Limpiar el estado de los mocks antes de cada prueba
    vi.clearAllMocks()
    fetchMock.mockClear()
  })

  //
  // Tests

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
