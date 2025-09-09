import { z } from 'zod'
import {
  VALIDATION_ERROR_NAME_IS_REQUIRED,
  VALIDATION_ERROR_NAME_MUST_BE_STRING,
  VALIDATION_ERROR_NAME_EMPTY,
} from '../../../models/errors/validationError'

export const nameSchema = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) return VALIDATION_ERROR_NAME_IS_REQUIRED
      return VALIDATION_ERROR_NAME_MUST_BE_STRING
    },
  })
  .min(1, { error: VALIDATION_ERROR_NAME_EMPTY })
