import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { UpdateExpenseCategoryInput, UpdateExpenseCategoryInputSchema } from './models'

export function validateUpdateExpenseCategoryInput(
  input: unknown,
): asserts input is UpdateExpenseCategoryInput {
  try {
    UpdateExpenseCategoryInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
