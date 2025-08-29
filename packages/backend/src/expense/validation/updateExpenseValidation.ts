import { ZodError } from 'zod/v3'
import { ValidationError } from '../../models/errors/validationError'
import { UpdateExpenseInput, updateExpenseSchema } from './models'

export function validateUpdateExpenseInput(input: unknown): asserts input is UpdateExpenseInput {
  try {
    updateExpenseSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
