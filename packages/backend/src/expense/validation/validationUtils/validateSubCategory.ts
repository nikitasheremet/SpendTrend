import {
  VALIDATION_ERROR_SUBCATEGORY_MISSING,
  VALIDATION_ERROR_SUBCATEGORY_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const subCategorySchema = z.string({
  error: (iss) => {
    if (iss.input === undefined) {
      return VALIDATION_ERROR_SUBCATEGORY_MISSING
    }
    return VALIDATION_ERROR_SUBCATEGORY_TYPE
  },
})
