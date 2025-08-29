import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { GetExpensesInput, getExpensesSchema } from './models'

export function validateGetExpensesInput(input: unknown): asserts input is GetExpensesInput {
  try {
    getExpensesSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
