import {
  VALIDATION_ERROR_CATEGORY_ID_MISSING,
  VALIDATION_ERROR_CATEGORY_ID_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const categoryIdSchema = z.uuid({
  error: (iss) => {
    if (iss.input === undefined) {
      return VALIDATION_ERROR_CATEGORY_ID_MISSING
    }
    return VALIDATION_ERROR_CATEGORY_ID_TYPE
  },
})
