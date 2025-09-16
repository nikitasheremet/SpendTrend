import * as z from 'zod'
import { userIdSchema, accountIdSchema, nameSchema, idSchema } from './validationUtils'
import { VALIDATION_INPUT_MUST_BE_AN_OBJECT } from '../../models/errors/validationError'

export const CreateExpenseCategoryInputSchema = z.strictObject(
  {
    userId: userIdSchema,
    accountId: accountIdSchema,
    name: nameSchema,
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

export const DeleteExpenseCategoryInputSchema = z.object(
  {
    userId: userIdSchema,
    accountId: accountIdSchema,
    id: idSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export type DeleteExpenseCategoryInput = z.infer<typeof DeleteExpenseCategoryInputSchema>

export const UpdateExpenseCategoryInputSchema = z.object(
  {
    id: idSchema,
    userId: userIdSchema,
    accountId: accountIdSchema,
    name: nameSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export type UpdateExpenseCategoryInput = z.infer<typeof UpdateExpenseCategoryInputSchema>
