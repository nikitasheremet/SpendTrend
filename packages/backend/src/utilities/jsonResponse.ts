import type { Context } from 'hono'

export function jsonResponse(ctx: Context, body: unknown, status: number): Response {
  const contextWithOptionalJson = ctx as Context & {
    json?: (responseBody: unknown, responseStatus?: number) => Response
  }

  if (typeof contextWithOptionalJson.json === 'function') {
    return contextWithOptionalJson.json(body, status)
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}
