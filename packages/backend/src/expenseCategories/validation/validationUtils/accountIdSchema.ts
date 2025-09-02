import { z } from 'zod'
import {
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
} from '../../../models/errors/validationError'

export const accountIdSchema = z.uuid({
  error: (iss) => {
    if (iss.input === undefined) return VALIDATION_ERROR_ACCOUNTID_MISSING
    return VALIDATION_ERROR_ACCOUNTID_TYPE
  },
})
