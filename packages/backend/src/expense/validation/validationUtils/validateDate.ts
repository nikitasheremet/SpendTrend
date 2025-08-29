import {
  DATE_REGEX_YYYY_MM_DD,
  VALIDATION_ERROR_DATE_EMPTY,
  VALIDATION_ERROR_DATE_FORMAT,
  VALIDATION_ERROR_DATE_MISSING,
  VALIDATION_ERROR_DATE_TYPE,
} from '../../../models/errors/validationError'
import * as z from 'zod'

export const dateSchema = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) {
        return VALIDATION_ERROR_DATE_MISSING
      }
      return VALIDATION_ERROR_DATE_TYPE
    },
  })
  .min(1, { error: VALIDATION_ERROR_DATE_EMPTY })
  .refine((d) => DATE_REGEX_YYYY_MM_DD.test(d), { error: VALIDATION_ERROR_DATE_FORMAT })
