import { formatPastedBankData } from '@/helpers/bankInfoFormatting/formatPastedBankData'
import { DataType, type FormattedBankData } from '@/helpers/bankInfoFormatting/bankInfoTypes'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import type { LastAddDataPaste } from '@/types/lastAddDataPaste'
import type {
  PasteFidelity,
  PasteParseSummary,
} from '@contracts/failedPasteReport/createFailedPasteReport'
import { MONTH_WORDS, SCRAMBLE_ALLOWLIST } from './scrambleAllowlist'

// Returns a number in [0, 1), like Math.random.
export type RandomSource = () => number

export type PasteToScramble = Pick<LastAddDataPaste, 'html' | 'text' | 'parsedRows'>

export interface ScrambledPaste {
  scrambledHtml: string
  scrambledText: string
  parsedRows: FormattedBankData[]
  fidelity: PasteFidelity
  isTruncated: boolean
}

const MAX_PASTE_BYTES = 2 * 1024 * 1024
const KEPT_ATTRIBUTES = ['colspan', 'rowspan']
const DIGITS = '123456789'
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE_LETTERS = LOWERCASE_LETTERS.toUpperCase()
const SCRAMBLED_CHARACTER_PATTERN = /[1-9]|\p{L}/gu
// Each cell and line is checked for a date on its own, as the parser reads cells.
const CELL_BREAK_PATTERN = /([\t\r\n]+)/
const ALLOWLIST_PATTERN = new RegExp(
  `(?<!\\p{L})(${SCRAMBLE_ALLOWLIST.map(escapeRegExp).join('|')})(?!\\p{L})`,
  'iu',
)
const MONTH_PATTERN = `(?:${MONTH_WORDS.join('|')})\\.?`
// The browser's date parser accepts almost anything with a number in it, such as
// "Store 42", so only text shaped like a date is offered to it.
const DATE_SHAPES = [
  /^\d{4}-\d{1,2}-\d{1,2}$/,
  /^\d{4}\/\d{1,2}\/\d{1,2}$/,
  /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
  new RegExp(`^${MONTH_PATTERN}\\s+\\d{1,2},?\\s*\\d{4}$`, 'i'),
  new RegExp(`^\\d{1,2}\\s+${MONTH_PATTERN},?\\s+\\d{4}$`, 'i'),
]

// Scrambles an Add Data Paste so no real amounts, names or other text leave the browser,
// then parses the scrambled HTML again to check it still parses like the original.
export function scramblePaste(
  { html, text, parsedRows: originalRows }: PasteToScramble,
  random: RandomSource = Math.random,
): ScrambledPaste {
  const scrambledHtml = truncateToBytes(scrambleHtml(html, random), MAX_PASTE_BYTES)
  const scrambledText = truncateToBytes(scrambleText(text, random), MAX_PASTE_BYTES)
  const parsedRows = parseScrambledHtml(scrambledHtml.value)

  return {
    scrambledHtml: scrambledHtml.value,
    scrambledText: scrambledText.value,
    parsedRows,
    fidelity: compareParses(originalRows, parsedRows),
    isTruncated: scrambledHtml.isTruncated || scrambledText.isTruncated,
  }
}

// Truncation can cut a row short in a way the parser throws on. The report should still
// send, and the fidelity check then shows the rows went missing.
function parseScrambledHtml(scrambledHtml: string): FormattedBankData[] {
  try {
    return formatPastedBankData(scrambledHtml)
  } catch {
    return []
  }
}

function scrambleHtml(html: string, random: RandomSource): string {
  if (!html) {
    return ''
  }

  const document = new DOMParser().parseFromString(html, 'text/html')
  // Template contents sit outside the tree, so they'd be skipped rather than scrambled.
  document.querySelectorAll('template').forEach((template) => template.remove())
  document.querySelectorAll('*').forEach(removeAttributesExceptSpans)
  for (const node of collectTextAndCommentNodes(document)) {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove()
    } else {
      node.data = scrambleText(node.data, random)
    }
  }
  return document.documentElement.outerHTML
}

function removeAttributesExceptSpans(element: Element) {
  for (const attributeName of element.getAttributeNames()) {
    if (!KEPT_ATTRIBUTES.includes(attributeName)) {
      element.removeAttribute(attributeName)
    }
  }
}

function collectTextAndCommentNodes(document: Document): CharacterData[] {
  const walker = document.createTreeWalker(
    document.documentElement,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT,
  )
  const nodes: CharacterData[] = []
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as CharacterData)
  }
  return nodes
}

function scrambleText(text: string, random: RandomSource): string {
  return text
    .split(CELL_BREAK_PATTERN)
    .map((segment) => (isKeptDate(segment.trim()) ? segment : scrambleWords(segment, random)))
    .join('')
}

function isKeptDate(text: string): boolean {
  return DATE_SHAPES.some((shape) => shape.test(text)) && isAcceptedByDateParser(text)
}

function isAcceptedByDateParser(text: string): boolean {
  try {
    formatDate(text, DateFormat.YYYY_MM_DD)
    return true
  } catch {
    return false
  }
}

function scrambleWords(text: string, random: RandomSource): string {
  // Splitting on a capturing pattern puts the allowlisted matches at odd indices.
  return text
    .split(ALLOWLIST_PATTERN)
    .map((part, index) => (index % 2 === 1 ? part : scrambleCharacters(part, random)))
    .join('')
}

function scrambleCharacters(text: string, random: RandomSource): string {
  return text.replace(SCRAMBLED_CHARACTER_PATTERN, (character) => {
    if (DIGITS.includes(character)) {
      return pickOne(DIGITS, random)
    }
    const isUppercase = character !== character.toLowerCase()
    return pickOne(isUppercase ? UPPERCASE_LETTERS : LOWERCASE_LETTERS, random)
  })
}

function pickOne(options: string, random: RandomSource): string {
  return options[Math.floor(random() * options.length)]
}

function truncateToBytes(value: string, maxBytes: number): { value: string; isTruncated: boolean } {
  const bytes = new TextEncoder().encode(value)
  if (bytes.length <= maxBytes) {
    return { value, isTruncated: false }
  }

  // A character cut in half decodes as a trailing replacement character, so drop it.
  const truncatedValue = new TextDecoder().decode(bytes.subarray(0, maxBytes))
  return { value: truncatedValue.replace(/�$/, ''), isTruncated: true }
}

function compareParses(
  originalRows: FormattedBankData[],
  scrambledRows: FormattedBankData[],
): PasteFidelity {
  const original = summariseParse(originalRows)
  const scrambled = summariseParse(scrambledRows)
  const summaryKeys = Object.keys(original) as (keyof PasteParseSummary)[]
  const matches = summaryKeys.every((key) => original[key] === scrambled[key])
  return { original, scrambled, matches }
}

function summariseParse(rows: FormattedBankData[]): PasteParseSummary {
  return {
    rowCount: rows.length,
    expenseCount: rows.filter((row) => row.type === DataType.EXPENSE).length,
    incomeCount: rows.filter((row) => row.type === DataType.INCOME).length,
    rowsWithoutDate: rows.filter((row) => !row.date).length,
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
