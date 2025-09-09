import {
  VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING,
  VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE,
  VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const paidBackAmountSchema = z
  .number({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_PAIDBACKAMOUNT_MISSING
      }
      return VALIDATION_ERROR_PAIDBACKAMOUNT_TYPE
    },
  })
  .min(0, { error: VALIDATION_ERROR_PAIDBACKAMOUNT_NEGATIVE })
