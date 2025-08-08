import { ValidationError } from '../models/errors/validationError'
import { STATUS_UNPROCESSABLE_ENTITY_422 } from '../models/statusCodes'

export function errorStatusMapper(error: unknown): number {
  if (error instanceof ValidationError) {
    return STATUS_UNPROCESSABLE_ENTITY_422
  }

  return 500 // default status code
}
