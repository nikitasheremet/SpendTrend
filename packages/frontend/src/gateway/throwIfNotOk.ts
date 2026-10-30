import { handleUnauthorized } from './handleUnathorized'
import { HttpError } from './httpError'
import { TOO_MANY_REQUESTS_STATUS, TooManyRequestsError } from './tooManyRequestsError'

const UNAUTHORIZED_STATUS = 401

export function throwIfNotOk(response: Response) {
  if (response.ok) {
    return
  }

  if (response.status === UNAUTHORIZED_STATUS) {
    handleUnauthorized()
  }

  if (response.status === TOO_MANY_REQUESTS_STATUS) {
    throw new TooManyRequestsError(readRetryAfterSeconds(response))
  }

  throw new HttpError(response.status)
}

// Only the delay-seconds form of Retry-After; our backend never sends an HTTP date.
function readRetryAfterSeconds(response: Response): number | undefined {
  const retryAfterSeconds = Number.parseInt(response.headers.get('Retry-After') ?? '', 10)
  return Number.isNaN(retryAfterSeconds) ? undefined : retryAfterSeconds
}
