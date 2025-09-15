import { z } from 'zod'
import { VALIDATION_INPUT_MUST_BE_AN_OBJECT } from '../../models/errors/validationError'
import {
  userIdSchema,
  accountIdSchema,
  categoryIdSchema,
  nameSchema,
  subCategoryIdSchema,
} from './validationUtils'

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

export const updateExpenseSubCategoryInputSchema = z.strictObject(
  {
    subCategoryId: subCategoryIdSchema,
    userId: userIdSchema,
    accountId: accountIdSchema,
    name: nameSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export type UpdateExpenseSubCategoryInput = z.infer<typeof updateExpenseSubCategoryInputSchema>

export const deleteExpenseSubCategoryInputSchema = z.strictObject(
  {
    userId: userIdSchema,
    accountId: accountIdSchema,
    subCategoryId: subCategoryIdSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export type DeleteExpenseSubCategoryInput = z.infer<typeof deleteExpenseSubCategoryInputSchema>
