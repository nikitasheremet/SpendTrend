export const REPORT_BANKS = [
  'RBC',
  'TD',
  'Scotiabank',
  'BMO',
  'CIBC',
  'National Bank',
  'Other',
] as const

export type ReportBank = (typeof REPORT_BANKS)[number]

export type FailedPasteReportParsedRow = {
  type: 'expense' | 'income'
  date?: string
  name: string
  amount: number
}

// Counts only, so the fidelity check never holds real values.
export type PasteParseSummary = {
  rowCount: number
  expenseCount: number
  incomeCount: number
  rowsWithoutDate: number
}

export type PasteFidelity = {
  original: PasteParseSummary
  scrambled: PasteParseSummary
  matches: boolean
}

// User and account come from the session on the server, so they're never sent.
export type CreateFailedPasteReportRequest = {
  bank: ReportBank
  otherBankName?: string
  message: string
  appVersion: string
  userAgent: string
  pastedAt: string
  clipboardTypes: string[]
  expenseCount: number
  incomeCount: number
  scrambledHtml: string
  scrambledText: string
  // From parsing scrambledHtml, so they match the HTML that's sent. Cut down to at
  // most 500 rows with names up to 200 characters, flagged by areParsedRowsTruncated.
  parsedRows: FailedPasteReportParsedRow[]
  fidelity: PasteFidelity
  isTruncated: boolean
  areParsedRowsTruncated: boolean
}

export type CreateFailedPasteReportResponse = Record<string, never>
