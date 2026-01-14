import DOMPurify from 'dompurify'
import { DataType, FormattedBankData } from './formatBankData'
import { DateFormat, formatDate } from '../date/formatDate'
import { de } from 'date-fns/locale'

export function formatPastedData(pastedHtml: string) {
  const purified = DOMPurify.sanitize(pastedHtml, { FORBID_ATTR: ['style', 'class'] })
  const htmlAsDocument = new DOMParser().parseFromString(purified, 'text/html')

  console.log('Pasted HTML as Document:', htmlAsDocument)

  const rowsOfData = Array.from(htmlAsDocument.querySelectorAll('tr'))

  console.log('Extracted Rows of Data:', rowsOfData)

  const extractedNewDataRows = rowsOfData.map((pastedRow) => {
    console.log('Processing Row:', pastedRow.innerText)
    const cellsInRow = Array.from(pastedRow.cells)
    console.log(
      'Cells in Row:',
      cellsInRow.map((cell) => cell.innerText),
    )
    const noCellsHaveText = Boolean(cellsInRow.find((cell) => cell.innerText.trim()))
    if (!noCellsHaveText) return undefined
    const newData = {} as FormattedBankData

    let newDate: string | undefined

    try {
      newDate = formatDate(cellsInRow[0].innerText, DateFormat.YYYY_MM_DD)
    } catch {
      newDate = undefined
    }

    newData.date = newDate
    const [description, descriptionIndex] = extractDescription(cellsInRow, 1)
    newData.name = description

    const expenseAmountIndex = descriptionIndex + 1
    const expenseAmount = cleanNumber(cellsInRow[expenseAmountIndex].innerText)

    if (expenseAmount !== undefined) {
      newData.amount = expenseAmount
      newData.type = DataType.EXPENSE
    } else {
      newData.type = DataType.INCOME
      const restOfNumbersIndex = expenseAmountIndex + 1
      const incomeAmount = cellsInRow
        .slice(restOfNumbersIndex)
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

function extractDescription(
  cells: HTMLTableCellElement[],
  cellIndexToLookFrom: number,
): [string, number] {
  const descIndex = cells.slice(cellIndexToLookFrom).findIndex((cell) => cell.innerText)
  if (descIndex === -1) {
    console.error('No description found in cells starting from index ' + cellIndexToLookFrom)
  }
  const adjustedIndex = descIndex + cellIndexToLookFrom
  return [cells[adjustedIndex].innerText, adjustedIndex]
}
