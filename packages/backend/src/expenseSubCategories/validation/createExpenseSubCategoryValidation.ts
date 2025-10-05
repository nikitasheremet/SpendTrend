import { CreateExpenseSubCategoryInput, createExpenseSubCategoryInputSchema } from './models'
import { ValidationError } from '../../models/errors/validationError'

export function validateCreateExpenseSubCategoryInput(
  input: unknown,
): asserts input is CreateExpenseSubCategoryInput {
  try {
    createExpenseSubCategoryInputSchema.parse(input)
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError(error.message)
    }
    throw new ValidationError('Validation failed')
  }
}
