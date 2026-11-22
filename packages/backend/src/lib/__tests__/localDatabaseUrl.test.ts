import { isLocalDatabaseUrl } from '../localDatabaseUrl'

describe('isLocalDatabaseUrl', () => {
  it('accepts databases on localhost and 127.0.0.1', () => {
    expect(isLocalDatabaseUrl('postgres://postgres:postgres@localhost:5432/spend_trend')).toBe(true)
    expect(isLocalDatabaseUrl('postgres://postgres:postgres@127.0.0.1:5432/spend_trend')).toBe(true)
  })

  it('rejects remote, look-alike, missing and unparseable URLs', () => {
    for (const url of [
      'postgres://user:pass@db.render.com:5432/spend_trend',
      'postgres://user:pass@localhost.evil.com:5432/spend_trend',
      'postgres://localhost:pass@db.render.com:5432/spend_trend',
      undefined,
      '',
      'not a url',
    ]) {
      expect(isLocalDatabaseUrl(url)).toBe(false)
    }
  })
})
