import { deleteExpenseSubCategoryInputSchema, DeleteExpenseSubCategoryInput } from './models'
import { ValidationError } from '../../models/errors/validationError'
import { ZodError } from 'zod'

export function validateDeleteExpenseSubCategory(
  input: unknown,
): asserts input is DeleteExpenseSubCategoryInput {
  try {
    deleteExpenseSubCategoryInputSchema.parse(input)
  } catch (error) {
    const zodError = error as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
