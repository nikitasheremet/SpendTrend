// Words the parser or a developer relies on, kept unscrambled. Matched as whole words,
// ignoring case. Add to these lists when a bank's format needs more.

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTH_ABBREVIATIONS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

// extractExpensesAndIncomes skips a CIBC "Not applicable" cell before the amount.
const PARSER_PHRASES = ['Not applicable']

const COLUMN_WORDS = [
  'Date',
  'Description',
  'Debit',
  'Credit',
  'Withdrawal',
  'Withdrawals',
  'Deposit',
  'Deposits',
  'Balance',
  'Amount',
]

export const MONTH_WORDS = [...MONTH_NAMES, ...MONTH_ABBREVIATIONS]

export const SCRAMBLE_ALLOWLIST = [...MONTH_WORDS, ...PARSER_PHRASES, ...COLUMN_WORDS]
