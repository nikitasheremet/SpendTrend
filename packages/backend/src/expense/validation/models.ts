import { z } from 'zod'
import { VALIDATION_ERROR_NO_FIELDS_TO_UPDATE } from '../../models/errors/validationError'
import {
  accountIdSchema,
  amountSchema,
  dateSchema,
  idSchema,
  nameSchema,
  netAmountSchema,
  paidBackAmountSchema,
  userIdSchema,
  categoryIdSchema,
  subCategoryIdSchema,
} from './validationUtils'

export const createExpenseInputSchema = z.strictObject({
  name: nameSchema,
  userId: userIdSchema,
  accountId: accountIdSchema,
  amount: amountSchema,
  netAmount: netAmountSchema,
  date: dateSchema,
  categoryId: categoryIdSchema,
  subCategoryId: subCategoryIdSchema.optional(),
  paidBackAmount: paidBackAmountSchema,
})

export const DeleteExpensesInputSchema = z.strictObject({
  userId: userIdSchema,
  accountId: accountIdSchema,
  expenseId: idSchema,
})

export const getExpensesInputSchema = z.strictObject({
  userId: userIdSchema,
  accountId: accountIdSchema,
})

export const updateExpenseInputSchema = z
  .strictObject({
    id: idSchema,
    name: nameSchema.optional(),
    amount: amountSchema.optional(),
    netAmount: netAmountSchema.optional(),
    date: dateSchema.optional(),
    categoryId: categoryIdSchema.optional(),
    subCategoryId: subCategoryIdSchema.optional(),
    paidBackAmount: paidBackAmountSchema.optional(),
  })
  .refine(
    (obj) => {
      const { id, ...fieldsToUpdate } = obj
      return Object.keys(fieldsToUpdate).length > 0
    },
    { message: VALIDATION_ERROR_NO_FIELDS_TO_UPDATE },
  )

export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>
export type DeleteExpensesInput = z.infer<typeof DeleteExpensesInputSchema>
export type GetExpensesInput = z.infer<typeof getExpensesInputSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseInputSchema>
