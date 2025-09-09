import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { UpdateExpenseInput, updateExpenseInputSchema } from './models'

export function validateUpdateExpenseInput(input: unknown): asserts input is UpdateExpenseInput {
  try {
    updateExpenseInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
