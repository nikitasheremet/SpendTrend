import { isAllowedOrigin, trustedOrigins } from '../allowedOrigins'

describe('isAllowedOrigin', () => {
  it('allows the deployed frontends in every environment', () => {
    expect(
      isAllowedOrigin('https://spendtrend-mz44.onrender.com', { NODE_ENV: 'production' }),
    ).toBe(true)
  })

  it('allows any localhost port when NODE_ENV is local', () => {
    expect(isAllowedOrigin('http://localhost:20090', { NODE_ENV: 'local' })).toBe(true)
  })

  it('allows only the usual localhost port outside local', () => {
    expect(isAllowedOrigin('http://localhost:5173', { NODE_ENV: 'dev' })).toBe(true)
    expect(isAllowedOrigin('http://localhost:20090', { NODE_ENV: 'dev' })).toBe(false)
    expect(isAllowedOrigin('http://localhost:20090', { NODE_ENV: 'production' })).toBe(false)
  })

  it('rejects look-alike origins even when NODE_ENV is local', () => {
    for (const origin of [
      'http://localhost.evil.com:20090',
      'https://localhost:20090',
      'http://127.0.0.1:20090',
      'http://localhost',
      'http://localhost:20090.evil.com',
    ]) {
      expect(isAllowedOrigin(origin, { NODE_ENV: 'local' })).toBe(false)
    }
  })
})

describe('trustedOrigins', () => {
  it('adds a localhost wildcard for better-auth only when NODE_ENV is local', () => {
    expect(trustedOrigins({ NODE_ENV: 'local' })).toContain('http://localhost:*')
    expect(trustedOrigins({ NODE_ENV: 'production' })).not.toContain('http://localhost:*')
    expect(trustedOrigins({ NODE_ENV: 'production' })).toContain(
      'https://spendtrend-mz44.onrender.com',
    )
  })
})
