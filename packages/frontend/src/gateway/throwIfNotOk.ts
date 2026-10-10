import { handleUnauthorized } from './handleUnathorized'

const UNAUTHORIZED_STATUS = 401

export function throwIfNotOk(response: Response) {
  if (response.ok) {
    return
  }

  if (response.status === UNAUTHORIZED_STATUS) {
    handleUnauthorized()
  }

  throw new Error(`HTTP Error: Status: ${response.status}`)
}
