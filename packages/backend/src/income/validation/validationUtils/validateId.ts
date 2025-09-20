import {
  VALIDATION_ERROR_INCOMEID_MISSING,
  VALIDATION_ERROR_INCOMEID_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const idSchema = z.uuid({
  error: (iss) => {
    if (iss.input === undefined) {
      return VALIDATION_ERROR_INCOMEID_MISSING
    }
    return VALIDATION_ERROR_INCOMEID_TYPE
  },
})
