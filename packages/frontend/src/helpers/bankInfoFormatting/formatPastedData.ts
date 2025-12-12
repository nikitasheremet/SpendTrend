import DOMPurify from 'dompurify'
import { DataType, FormattedBankData } from './formatBankData'
import { DateFormat, formatDate } from '../date/formatDate'

export function formatPastedData(pastedHtml: string) {
  const purified = DOMPurify.sanitize(pastedHtml, { FORBID_ATTR: ['style', 'class'] })
  const htmlAsDocument = new DOMParser().parseFromString(purified, 'text/html')

  const rowsOfData = Array.from(htmlAsDocument.querySelectorAll('tr'))

  const extractedNewDataRows = rowsOfData.map((pastedRow) => {
    const cellsInRow = Array.from(pastedRow.cells)
    if (cellsInRow.length === 0) return undefined
    const newData = {} as FormattedBankData

    let newDate: string | undefined

    try {
      newDate = formatDate(cellsInRow[0].innerText, DateFormat.YYYY_MM_DD)
    } catch {
      newDate = undefined
    }

    newData.date = newDate
    newData.name = cellsInRow[1].innerText

    const expenseAmount = cleanNumber(cellsInRow[2].innerText)

    if (expenseAmount !== undefined) {
      newData.amount = expenseAmount
      newData.type = DataType.EXPENSE
    } else {
      newData.type = DataType.INCOME
      const incomeAmount = cellsInRow
        .slice(3)
        .map((cell) => cleanNumber(cell.innerText))
        .find((amount) => amount !== undefined)
      if (incomeAmount == undefined) {
        console.error('NO INCOME AMOUNT COULD BE FOUND FOR', cellsInRow)
      }
      newData.amount = incomeAmount || 0
    }
    return newData
  })
  return extractedNewDataRows.filter((data) => data !== undefined) as FormattedBankData[]
}

function cleanNumber(value: string): number | undefined {
  const cleanedValue = parseFloat(value.replace('$', '').replace(',', '').replace('−', '-'))
  const isNumber = Boolean(cleanedValue) && !isNaN(cleanedValue)
  if (isNumber) {
    return Math.abs(cleanedValue)
  }
  return undefined
}
