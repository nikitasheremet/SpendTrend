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
}

export type CreateFailedPasteReportResponse = Record<string, never>
