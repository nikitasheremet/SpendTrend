import { ContentfulStatusCode } from 'hono/utils/http-status'
import { NOT_FOUND_ERROR, RepositoryError } from '../models/errors/repositoryErrors'
import { ValidationError } from '../models/errors/validationError'
import { ReportingNotConfiguredError } from '../models/errors/reportingNotConfiguredError'
import {
  STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_NOT_FOUND_404,
  STATUS_SERVICE_UNAVAILABLE_503,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../models/statusCodes'

export function errorStatusMapper(error: unknown): ContentfulStatusCode {
  if (error instanceof ValidationError) {
    return STATUS_UNPROCESSABLE_ENTITY_422
  }

  if (error instanceof ReportingNotConfiguredError) {
    return STATUS_SERVICE_UNAVAILABLE_503
  }

  if (error instanceof RepositoryError) {
    if (error.message.includes(NOT_FOUND_ERROR)) {
      return STATUS_NOT_FOUND_404
    }
  }

  return STATUS_INTERNAL_SERVER_ERROR_500
}
