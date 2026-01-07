import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { CreateExpensesInput, createExpensesInputSchema } from './models'

export function validateCreateExpenseInput(input: unknown): asserts input is CreateExpensesInput {
  try {
    createExpensesInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
