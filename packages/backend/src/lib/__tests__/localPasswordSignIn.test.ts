import { isLocalPasswordSignInEnabled } from '../localPasswordSignIn'

const LOCAL_DB = 'postgres://postgres:postgres@localhost:5432/spend_trend'
const REMOTE_DB = 'postgres://user:pass@db.render.com:5432/spend_trend'

describe('isLocalPasswordSignInEnabled', () => {
  it('is on when NODE_ENV is local and the database is on localhost', () => {
    expect(isLocalPasswordSignInEnabled({ NODE_ENV: 'local', DATABASE_URL: LOCAL_DB })).toBe(true)
  })

  it('also accepts 127.0.0.1 as a local database host', () => {
    const databaseUrl = 'postgres://postgres:postgres@127.0.0.1:5432/spend_trend'
    expect(isLocalPasswordSignInEnabled({ NODE_ENV: 'local', DATABASE_URL: databaseUrl })).toBe(
      true,
    )
  })

  // Deployed environments run on a remote database, so outside local the remote DB
  // must turn password sign-in off quietly, not stop the backend from starting.
  it.each(['production', 'dev', 'test', 'LOCAL', ' local', 'local ', '', undefined])(
    'is off when NODE_ENV is %j, with a localhost or a remote database',
    (nodeEnv) => {
      for (const databaseUrl of [LOCAL_DB, REMOTE_DB]) {
        expect(isLocalPasswordSignInEnabled({ NODE_ENV: nodeEnv, DATABASE_URL: databaseUrl })).toBe(
          false,
        )
      }
    },
  )

  it.each([
    'postgres://user:pass@db.render.com:5432/spend_trend',
    'postgres://user:pass@localhost.evil.com:5432/spend_trend',
    'postgres://localhost:pass@db.render.com:5432/spend_trend',
    'postgres://user:pass@192.168.1.10:5432/spend_trend',
    'not a url',
    '',
    undefined,
  ])('refuses to run with NODE_ENV local and DATABASE_URL %j', (databaseUrl) => {
    expect(() =>
      isLocalPasswordSignInEnabled({ NODE_ENV: 'local', DATABASE_URL: databaseUrl }),
    ).toThrow(/localhost/)
  })
})
