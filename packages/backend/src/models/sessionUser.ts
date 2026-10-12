export interface SessionUser {
  id: string
  accountId: string
}

declare module 'hono' {
  interface ContextVariableMap {
    sessionUser: SessionUser
  }
}
