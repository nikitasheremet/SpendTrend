import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { DeleteExpensesInput, DeleteExpensesInputSchema } from './models'

export function validateDeleteExpenseInput(input: unknown): asserts input is DeleteExpensesInput {
  try {
    DeleteExpensesInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
