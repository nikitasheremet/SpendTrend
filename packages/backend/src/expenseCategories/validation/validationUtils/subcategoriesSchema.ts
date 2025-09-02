import { z } from 'zod'
import {
  VALIDATION_ERROR_SUBCATEGORIES_MISSING,
  VALIDATION_ERROR_SUBCATEGORIES_MUST_BE_ARRAY,
  VALIDATION_ERROR_SUBCATEGORIES_ITEMS_MUST_BE_STRINGS,
} from '../../../models/errors/validationError'

export const subcategoriesSchema = z.array(
  z.string({ error: VALIDATION_ERROR_SUBCATEGORIES_ITEMS_MUST_BE_STRINGS }).min(1),
  {
    error: (iss) =>
      iss.input === undefined
        ? VALIDATION_ERROR_SUBCATEGORIES_MISSING
        : VALIDATION_ERROR_SUBCATEGORIES_MUST_BE_ARRAY,
  },
)
