import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { DeleteIncomeInput, deleteIncomeInputSchema } from './models'

export function validateDeleteIncomeInput(input: unknown): asserts input is DeleteIncomeInput {
  try {
    deleteIncomeInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
