import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { GetIncomeInput, getIncomeInputSchema } from './models'

export function validateGetIncomesInput(input: unknown): asserts input is GetIncomeInput {
  try {
    getIncomeInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}