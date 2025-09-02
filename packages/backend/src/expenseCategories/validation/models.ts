import * as z from 'zod'
import { userIdSchema, accountIdSchema, nameSchema, subcategoriesSchema } from './validationUtils'
import { VALIDATION_INPUT_MUST_BE_AN_OBJECT } from '../../models/errors/validationError'

export const CreateExpenseCategoryInputSchema = z.object(
  {
    userId: userIdSchema,
    accountId: accountIdSchema,
    name: nameSchema,
    subcategories: subcategoriesSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export type CreateExpenseCategoryInput = z.infer<typeof CreateExpenseCategoryInputSchema>

export const GetExpenseCategoriesInputSchema = z.object(
  {
    userId: userIdSchema,
    accountId: accountIdSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export type GetExpenseCategoriesInput = z.infer<typeof GetExpenseCategoriesInputSchema>
