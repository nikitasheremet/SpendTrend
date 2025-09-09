import { z } from 'zod'
import {
  VALIDATION_ERROR_EXPENSECATEGORYID_MISSING,
  VALIDATION_ERROR_EXPENSECATEGORYID_TYPE,
} from '../../../models/errors/validationError'

export const idSchema = z.uuid({
  error: (iss) => {
    if (iss.input === undefined) return VALIDATION_ERROR_EXPENSECATEGORYID_MISSING
    return VALIDATION_ERROR_EXPENSECATEGORYID_TYPE
  },
})
