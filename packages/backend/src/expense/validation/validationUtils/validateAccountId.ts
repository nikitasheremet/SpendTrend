import {
  VALIDATION_ERROR_ACCOUNTID_MISSING,
  VALIDATION_ERROR_ACCOUNTID_TYPE,
  VALIDATION_ERROR_ACCOUNTID_EMPTY,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const accountIdSchema = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_ACCOUNTID_MISSING
      }
      return VALIDATION_ERROR_ACCOUNTID_TYPE
    },
  })
  .min(1, { error: VALIDATION_ERROR_ACCOUNTID_EMPTY })
