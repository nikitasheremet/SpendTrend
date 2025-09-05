import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { DeleteExpenseCategoryInput, DeleteExpenseCategoryInputSchema } from './models'

export function validateDeleteExpenseCategoryInput(
  input: unknown,
): asserts input is DeleteExpenseCategoryInput {
  try {
    DeleteExpenseCategoryInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}