import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { GetExpenseCategoriesInput, GetExpenseCategoriesInputSchema } from './models'

export function validateGetExpenseCategoriesInput(
  input: unknown,
): asserts input is GetExpenseCategoriesInput {
  try {
    GetExpenseCategoriesInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
