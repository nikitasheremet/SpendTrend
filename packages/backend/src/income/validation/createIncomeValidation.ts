import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { CreateIncomesInput, createIncomesInputSchema } from './models'

export function validateCreateIncomeInput(input: unknown): asserts input is CreateIncomesInput {
  try {
    createIncomesInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
