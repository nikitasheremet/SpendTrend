import { HttpError } from './httpError'

export const TOO_MANY_REQUESTS_STATUS = 429

export class TooManyRequestsError extends HttpError {
  // From the Retry-After header, when the server sent one.
  readonly retryAfterSeconds?: number

  constructor(retryAfterSeconds?: number) {
    super(TOO_MANY_REQUESTS_STATUS)
    this.name = 'TooManyRequestsError'
    this.retryAfterSeconds = retryAfterSeconds
  }
}
