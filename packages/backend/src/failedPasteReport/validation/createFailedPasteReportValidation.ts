import { ZodError } from 'zod'
import { ValidationError } from '../../models/errors/validationError'
import { CreateFailedPasteReportInput, createFailedPasteReportInputSchema } from './models'

// Returns the parsed report: trimmed, and without any fields the schema doesn't know.
export function validateCreateFailedPasteReportInput(input: unknown): CreateFailedPasteReportInput {
  try {
    return createFailedPasteReportInputSchema.parse(input)
  } catch (err: unknown) {
    const zodError = err as ZodError
    throw new ValidationError(zodError.issues[0].message)
  }
}
