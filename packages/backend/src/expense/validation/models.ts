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

export const createExpensesInputSchema = z.strictObject({
  userId: userIdSchema,
  accountId: accountIdSchema,
  expensesToCreate: z.array(
    z.strictObject({
      name: nameSchema,
      amount: amountSchema,
      netAmount: netAmountSchema,
      date: dateSchema,
      categoryId: categoryIdSchema,
      subCategoryId: subCategoryIdSchema.optional(),
      paidBackAmount: paidBackAmountSchema,
    }),
  ),
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
    userId: userIdSchema,
    accountId: accountIdSchema,
    name: nameSchema.optional(),
    amount: amountSchema.optional(),
    netAmount: netAmountSchema.optional(),
    date: dateSchema.optional(),
    categoryId: categoryIdSchema.optional(),
    subCategoryId: subCategoryIdSchema.nullish(),
    paidBackAmount: paidBackAmountSchema.optional(),
  })
  .refine(
    (obj) => {
      const { id, userId, accountId, ...fieldsToUpdate } = obj
      return Object.keys(fieldsToUpdate).length > 0
    },
    { message: VALIDATION_ERROR_NO_FIELDS_TO_UPDATE },
  )

export type CreateExpensesInput = z.infer<typeof createExpensesInputSchema>
export type DeleteExpensesInput = z.infer<typeof DeleteExpensesInputSchema>
export type GetExpensesInput = z.infer<typeof getExpensesInputSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseInputSchema>
