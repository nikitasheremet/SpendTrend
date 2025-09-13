import * as z from 'zod'
import {
  VALIDATION_ERROR_SUBCATEGORY_ID_MISSING,
  VALIDATION_ERROR_SUBCATEGORY_ID_TYPE,
} from '../../../models/errors/validationError'

export const subCategoryIdSchema = z.uuid({
  error: (iss) => {
    if (iss.input === undefined) {
      return VALIDATION_ERROR_SUBCATEGORY_ID_MISSING
    }
    return VALIDATION_ERROR_SUBCATEGORY_ID_TYPE
  },
})
