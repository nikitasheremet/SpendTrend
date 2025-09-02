import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { CreateExpenseCategoryInput, CreateExpenseCategoryInputSchema } from './models'

export function validateCreateExpenseCategoryInput(
  input: unknown,
): asserts input is CreateExpenseCategoryInput {
  try {
    CreateExpenseCategoryInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
