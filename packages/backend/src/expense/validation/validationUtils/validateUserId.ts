import {
  VALIDATION_ERROR_USERID_EMPTY,
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const userIdSchema = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_USERID_MISSING
      }
      return VALIDATION_ERROR_USERID_TYPE
    },
  })
  .min(1, { error: VALIDATION_ERROR_USERID_EMPTY })
