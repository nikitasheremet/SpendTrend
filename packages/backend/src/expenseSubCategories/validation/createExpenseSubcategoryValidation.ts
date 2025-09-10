import { createExpenseSubcategoryInputSchema } from './models'
import { ValidationError } from '../../models/errors/validationError'

export function validateCreateExpenseSubcategoryInput(input: unknown): void {
  try {
    createExpenseSubcategoryInputSchema.parse(input)
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError(error.message)
    }
    throw new ValidationError('Validation failed')
  }
}
