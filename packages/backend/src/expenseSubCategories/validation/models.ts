import { z } from 'zod'
import { VALIDATION_INPUT_MUST_BE_AN_OBJECT } from '../../models/errors/validationError'
import { userIdSchema, accountIdSchema, categoryIdSchema, nameSchema } from './validationUtils'

export const createExpenseSubcategoryInputSchema = z.strictObject(
  {
    userId: userIdSchema,
    accountId: accountIdSchema,
    categoryId: categoryIdSchema,
    name: nameSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export type CreateExpenseSubcategoryInput = z.infer<typeof createExpenseSubcategoryInputSchema>
