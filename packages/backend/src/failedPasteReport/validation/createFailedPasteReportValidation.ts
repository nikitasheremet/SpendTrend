import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { CreateFailedPasteReportInput, createFailedPasteReportInputSchema } from './models'

export function validateCreateFailedPasteReportInput(
  input: unknown,
): asserts input is CreateFailedPasteReportInput {
  try {
    createFailedPasteReportInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
