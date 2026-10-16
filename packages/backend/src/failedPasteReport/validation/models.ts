import { z } from 'zod'

export const REPORT_BANKS = [
  'RBC',
  'TD',
  'Scotiabank',
  'BMO',
  'CIBC',
  'National Bank',
  'Other',
] as const
export const OTHER_BANK = 'Other'
const OTHER_BANK_NAME_MAX_LENGTH = 100
const MESSAGE_MAX_LENGTH = 2000
// The frontend cuts each to 2 MB, and a string can't have more characters than bytes.
const SCRAMBLED_PASTE_MAX_LENGTH = 2 * 1024 * 1024
export const PARSED_ROW_TYPES = ['expense', 'income'] as const

export const VALIDATION_ERROR_BANK = `Bank must be one of: ${REPORT_BANKS.join(', ')}`
export const VALIDATION_ERROR_OTHER_BANK_NAME = `Bank name is required when the bank is Other, up to ${OTHER_BANK_NAME_MAX_LENGTH} characters`
export const VALIDATION_ERROR_MESSAGE = `What went wrong must be 1 to ${MESSAGE_MAX_LENGTH} characters`

const pasteParseSummarySchema = z.object({
  rowCount: z.int().nonnegative(),
  expenseCount: z.int().nonnegative(),
  incomeCount: z.int().nonnegative(),
  rowsWithoutDate: z.int().nonnegative(),
})

export const createFailedPasteReportInputSchema = z
  .object({
    bank: z.enum(REPORT_BANKS, { error: VALIDATION_ERROR_BANK }),
    otherBankName: z.string().trim().max(OTHER_BANK_NAME_MAX_LENGTH).optional(),
    message: z
      .string({ error: VALIDATION_ERROR_MESSAGE })
      .trim()
      .min(1, VALIDATION_ERROR_MESSAGE)
      .max(MESSAGE_MAX_LENGTH, VALIDATION_ERROR_MESSAGE),
    appVersion: z.string().min(1),
    userAgent: z.string(),
    pastedAt: z.iso.datetime(),
    clipboardTypes: z.array(z.string()),
    expenseCount: z.int().nonnegative(),
    incomeCount: z.int().nonnegative(),
    scrambledHtml: z.string().max(SCRAMBLED_PASTE_MAX_LENGTH),
    scrambledText: z.string().max(SCRAMBLED_PASTE_MAX_LENGTH),
    parsedRows: z.array(
      z.object({
        type: z.enum(PARSED_ROW_TYPES),
        date: z.string().optional(),
        name: z.string(),
        amount: z.number(),
      }),
    ),
    fidelity: z.object({
      original: pasteParseSummarySchema,
      scrambled: pasteParseSummarySchema,
      matches: z.boolean(),
    }),
    isTruncated: z.boolean(),
  })
  .refine((report) => report.bank !== OTHER_BANK || Boolean(report.otherBankName), {
    error: VALIDATION_ERROR_OTHER_BANK_NAME,
    path: ['otherBankName'],
  })

export type CreateFailedPasteReportInput = z.infer<typeof createFailedPasteReportInputSchema>
