import {
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_NAME_EMPTY,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const nameSchema = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_NAME_IS_REQUIRED
      }
      return VALIDATION_ERROR_NAME_MUST_BE_STRING
    },
  })
  .min(1, { error: VALIDATION_ERROR_NAME_EMPTY })
