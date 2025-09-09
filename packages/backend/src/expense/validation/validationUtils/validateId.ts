import {
  VALIDATION_ERROR_EXPENSEID_EMPTY,
  VALIDATION_ERROR_EXPENSEID_MISSING,
  VALIDATION_ERROR_EXPENSEID_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const idSchema = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_EXPENSEID_MISSING
      }
      return VALIDATION_ERROR_EXPENSEID_TYPE
    },
  })
  .min(1, { error: VALIDATION_ERROR_EXPENSEID_EMPTY })
