import DOMPurify from 'dompurify'
import { extractExpensesAndIncomes } from './extractExpensesAndIncomes.js'
import { FormattedBankData } from './bankInfoTypes.js'

export function formatPastedBankData(pastedHtml: string) {
  console.log('Original Pasted HTML:', pastedHtml)
  const rowsOfData = cleanAndExtractRows(pastedHtml)
  const extractedNewDataRows = rowsOfData.map(extractExpensesAndIncomes)

  return extractedNewDataRows.filter((data) => data !== undefined) as FormattedBankData[]
}

function cleanAndExtractRows(pastedHtml: string): HTMLTableRowElement[] {
  const htmlAsDocument = parseHtmlIntoDocument(pastedHtml)
  return extractRowsFromHtml(htmlAsDocument)
}

function parseHtmlIntoDocument(pastedHtml: string): Document {
  const purified = DOMPurify.sanitize(pastedHtml, { FORBID_ATTR: ['style', 'class'] })
  const htmlAsDocument = new DOMParser().parseFromString(purified, 'text/html')
  return htmlAsDocument
}

function extractRowsFromHtml(htmlAsDocument: Document): HTMLTableRowElement[] {
  const rowsOfData = Array.from(htmlAsDocument.querySelectorAll('tr'))
  return rowsOfData
}
