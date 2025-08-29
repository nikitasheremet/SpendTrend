import {
  VALIDATION_ERROR_NETAMOUNT_MISSING,
  VALIDATION_ERROR_NETAMOUNT_NEGATIVE,
  VALIDATION_ERROR_NETAMOUNT_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const netAmountSchema = z
  .number({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_NETAMOUNT_MISSING
      }
      return VALIDATION_ERROR_NETAMOUNT_TYPE
    },
  })
  .min(0, { error: VALIDATION_ERROR_NETAMOUNT_NEGATIVE })
