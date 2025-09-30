import { z } from 'zod'
import { VALIDATION_INPUT_MUST_BE_AN_OBJECT } from '../../models/errors/validationError'
import {
  accountIdSchema,
  amountSchema,
  dateSchema,
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

export type CreateIncomeInput = z.infer<typeof createIncomeInputSchema>

export const getIncomesInputSchema = z.strictObject({
  userId: userIdSchema,
  accountId: accountIdSchema,
})

export type GetIncomesInput = z.infer<typeof getIncomesInputSchema>
