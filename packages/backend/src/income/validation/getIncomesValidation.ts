import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { GetIncomesInput, getIncomesInputSchema } from './models'

export function validateGetIncomesInput(input: unknown): asserts input is GetIncomesInput {
  try {
    getIncomesInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
