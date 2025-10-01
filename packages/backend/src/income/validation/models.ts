import { z } from 'zod'
import {
  VALIDATION_ERROR_NO_FIELDS_TO_UPDATE,
  VALIDATION_INPUT_MUST_BE_AN_OBJECT,
} from '../../models/errors/validationError'
import {
  accountIdSchema,
  amountSchema,
  dateSchema,
  idSchema,
  nameSchema,
  userIdSchema,
} from './validationUtils'

export const createIncomeInputSchema = z.strictObject(
  {
    name: nameSchema,
    userId: userIdSchema,
    accountId: accountIdSchema,
    amount: amountSchema,
    date: dateSchema,
  },
  { error: VALIDATION_INPUT_MUST_BE_AN_OBJECT },
)

export const getIncomesInputSchema = z.strictObject({
  userId: userIdSchema,
  accountId: accountIdSchema,
})

export const deleteIncomeInputSchema = z.strictObject({
  userId: userIdSchema,
  accountId: accountIdSchema,
  id: idSchema,
})

export const updateIncomeInputSchema = z
  .strictObject({
    id: idSchema,
    userId: userIdSchema,
    accountId: accountIdSchema,
    name: nameSchema.optional(),
    amount: amountSchema.optional(),
    date: dateSchema.optional(),
  })
  .refine(
    (obj) => {
      const { id, userId, accountId, ...fieldsToUpdate } = obj
      return Object.keys(fieldsToUpdate).length > 0
    },
    { message: VALIDATION_ERROR_NO_FIELDS_TO_UPDATE },
  )

export type CreateIncomeInput = z.infer<typeof createIncomeInputSchema>
export type GetIncomesInput = z.infer<typeof getIncomesInputSchema>
export type DeleteIncomeInput = z.infer<typeof deleteIncomeInputSchema>
export type UpdateIncomeInput = z.infer<typeof updateIncomeInputSchema>
