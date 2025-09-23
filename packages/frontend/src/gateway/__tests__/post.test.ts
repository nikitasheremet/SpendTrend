import { vi } from 'vitest'
import { post } from '@gateway/post'

describe('post function', () => {
  const mockFetch = vi.fn()
  global.fetch = mockFetch
  vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when the response is successful', () => {
    it('should return the data', async () => {
      const fakeData = { id: 1, name: 'test' }
      const fakeResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(fakeData),
      }
      mockFetch.mockResolvedValue(fakeResponse)

      const result = await post('/test', { payload: 'test' })

      expect(result).toEqual(fakeData)
    })
  })

  describe('when the response is not ok', () => {
    it('should throw an error with status', async () => {
      const fakeResponse = {
        ok: false,
        status: 404,
      }
      mockFetch.mockResolvedValue(fakeResponse)

      await expect(post('/test', {})).rejects.toThrow('HTTP Error: Status: 404')
    })
  })

  describe('when fetch throws an error', () => {
    it('should throw the error and log it', async () => {
      const fakeError = new Error('network error')
      mockFetch.mockRejectedValue(fakeError)

      await expect(post('/test', {})).rejects.toThrow(fakeError)
    })
  })
})
