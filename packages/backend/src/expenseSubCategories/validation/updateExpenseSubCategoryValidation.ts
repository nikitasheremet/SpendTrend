import { updateExpenseSubCategoryInputSchema, UpdateExpenseSubCategoryInput } from './models'
import { ValidationError } from '../../models/errors/validationError'
import { ZodError } from 'zod'

export function validateUpdateExpenseSubCategory(
  input: unknown,
): asserts input is UpdateExpenseSubCategoryInput {
  try {
    updateExpenseSubCategoryInputSchema.parse(input)
  } catch (error) {
    const zodError = error as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
