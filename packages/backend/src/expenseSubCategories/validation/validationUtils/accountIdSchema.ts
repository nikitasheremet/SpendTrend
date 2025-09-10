import {
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const accountIdSchema = z.uuid({
  error: (iss) => {
    if (iss.input === undefined) {
      return VALIDATION_ERROR_ACCOUNTID_MISSING
    }
    return VALIDATION_ERROR_ACCOUNTID_TYPE
  },
})
