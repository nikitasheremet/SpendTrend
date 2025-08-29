import { z } from 'zod'
import {
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
  VALIDATION_ERROR_NO_FIELDS_TO_UPDATE,
} from '../../models/errors/validationError'
import {
  accountIdSchema,
  amountSchema,
  categorySchema,
  dateSchema,
  idSchema,
  nameSchema,
  netAmountSchema,
  paidBackAmountSchema,
  subCategorySchema,
  userIdSchema,
} from './validationUtils'

export const createExpenseSchema = z.strictObject(
  {
    name: nameSchema,
    userId: userIdSchema,
    accountId: accountIdSchema,
    amount: amountSchema,
    netAmount: netAmountSchema,
    date: dateSchema,
    category: categorySchema,
    subCategory: subCategorySchema,
    paidBackAmount: paidBackAmountSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export const getExpensesSchema = z.strictObject(
  {
    userId: userIdSchema,
    accountId: accountIdSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export const updateExpenseSchema = z
  .strictObject(
    {
      id: idSchema,
      name: nameSchema.optional(),
      amount: amountSchema.optional(),
      netAmount: netAmountSchema.optional(),
      date: dateSchema.optional(),
      category: categorySchema.optional(),
      subCategory: subCategorySchema.optional(),
      paidBackAmount: paidBackAmountSchema.optional(),
    },
    { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
  )
  .refine(
    (obj) => {
      const { id, ...fieldsToUpdate } = obj
      return Object.keys(fieldsToUpdate).length > 0
    },
    { message: VALIDATION_ERROR_NO_FIELDS_TO_UPDATE },
  )

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type GetExpensesInput = z.infer<typeof getExpensesSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
