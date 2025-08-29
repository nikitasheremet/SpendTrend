import {
  VALIDATION_ERROR_AMOUNT_MISSING,
  VALIDATION_ERROR_AMOUNT_NEGATIVE,
  VALIDATION_ERROR_AMOUNT_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const amountSchema = z
  .number({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_AMOUNT_MISSING
      }
      return VALIDATION_ERROR_AMOUNT_TYPE
    },
  })
  .min(0, { error: VALIDATION_ERROR_AMOUNT_NEGATIVE })
