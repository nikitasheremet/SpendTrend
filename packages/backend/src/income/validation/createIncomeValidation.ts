import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { CreateIncomeInput, createIncomeInputSchema } from './models'

export function validateCreateIncomeInput(input: unknown): asserts input is CreateIncomeInput {
  try {
    createIncomeInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}