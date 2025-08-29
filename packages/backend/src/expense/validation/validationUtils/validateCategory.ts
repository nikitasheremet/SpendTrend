import {
  VALIDATION_ERROR_CATEGORY_EMPTY,
  VALIDATION_ERROR_CATEGORY_MISSING,
  VALIDATION_ERROR_CATEGORY_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const categorySchema = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_CATEGORY_MISSING
      }
      return VALIDATION_ERROR_CATEGORY_TYPE
    },
  })
  .min(1, { error: VALIDATION_ERROR_CATEGORY_EMPTY })
