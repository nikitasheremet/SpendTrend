import { handleUnauthorized } from './handleUnathorized'
import { HttpError } from './httpError'

const UNAUTHORIZED_STATUS = 401

export function throwIfNotOk(response: Response) {
  if (response.ok) {
    return
  }

  if (response.status === UNAUTHORIZED_STATUS) {
    handleUnauthorized()
  }

  throw new HttpError(response.status)
}
