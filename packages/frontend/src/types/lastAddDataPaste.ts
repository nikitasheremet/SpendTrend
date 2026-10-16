import type { FormattedBankData } from '@/helpers/bankInfoFormatting/bankInfoTypes'

// The most recent Add Data Paste, kept in memory only so it can be reported.
export interface LastAddDataPaste {
  html: string
  text: string
  clipboardTypes: string[]
  parsedRows: FormattedBankData[]
  expenseCount: number
  incomeCount: number
  pastedAt: string
}
