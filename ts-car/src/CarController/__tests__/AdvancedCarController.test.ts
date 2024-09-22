import { beforeEach, describe, expect, test, vi } from 'vitest'
import AdvancedCarController from '../AdvancedCarController.ts'
import { createXboxCarMapper } from '../mappers.ts'

describe('AdvancedCarController', () => {
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
  let controller: AdvancedCarController

  //
  // Set up

  beforeEach(() => {
    controller = new AdvancedCarController(0, createXboxCarMapper(), CAR_URL)
    vi.clearAllMocks()
  })

  //
  // Tests

  describe('handleStatusUpdated', () => {
    let statusMock: ReturnType<AdvancedCarController['getStatus']>

    beforeEach(() => {
      statusMock = {
        adelante: 0,
        atras: 0,
        rotarDer: 0,
        rotarIzq: 0,
        direccion: 0,
      }
      vi.spyOn(controller, 'getStatus').mockReturnValue(statusMock)
    })

    test('debe enviar el estado actualizado', () => {
      statusMock.adelante = 1
      statusMock.direccion = 1
      controller.handleStatusUpdated()

      expect(fetchMock).toHaveBeenCalledOnce()
      expect(fetchMock).toHaveBeenCalledWith(`${CAR_URL}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusMock),
      })
    })
  })
})
