import { vi } from 'vitest'
import router from '@/router'

vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}))

let get: typeof import('@gateway/get').get
let post: typeof import('@gateway/post').post
let put: typeof import('@gateway/put').put

describe('when a request returns 401 unauthorized', () => {
  const mockFetch = vi.fn()
  global.fetch = mockFetch
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeAll(async () => {
    // BASE_URL is read at module load, so stub it before importing the gateways
    vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:3000')
    ;({ get } = await import('@gateway/get'))
    ;({ post } = await import('@gateway/post'))
    ;({ put } = await import('@gateway/put'))
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

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
