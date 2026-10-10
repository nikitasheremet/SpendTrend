import { vi } from 'vitest'
import router from '@/router'
import { get } from '@gateway/get'
import { post } from '@gateway/post'
import { put } from '@gateway/put'

vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}))

describe('when a request returns 401 unauthorized', () => {
  const mockFetch = vi.fn()
  global.fetch = mockFetch
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    vi.mocked(router.push).mockReset()
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ error: 'Unauthorized' }),
    })
  })

  it.each([
    ['GET', () => get('test', {})],
    ['POST', () => post('test', {})],
    ['PUT', () => put('test', {})],
  ])('%s should navigate to login and reject', async (_method, request) => {
    await expect(request()).rejects.toThrow('HTTP Error: Status: 401')

    expect(router.push).toHaveBeenCalledWith('/login')
  })
})
