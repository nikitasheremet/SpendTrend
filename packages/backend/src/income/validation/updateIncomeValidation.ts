import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { UpdateIncomeInput, updateIncomeInputSchema } from './models'

export function validateUpdateIncomeInput(input: unknown): asserts input is UpdateIncomeInput {
  try {
    updateIncomeInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
