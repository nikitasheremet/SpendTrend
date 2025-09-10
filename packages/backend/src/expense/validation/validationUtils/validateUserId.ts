import {
  VALIDATION_ERROR_USERID_MISSING,
  VALIDATION_ERROR_USERID_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const userIdSchema = z.uuid({
  error: (iss) => {
    if (iss.input === undefined) {
      return VALIDATION_ERROR_USERID_MISSING
    }
    return VALIDATION_ERROR_USERID_TYPE
  },
})
