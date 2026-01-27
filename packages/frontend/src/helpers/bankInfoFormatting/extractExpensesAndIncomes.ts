import { DateFormat, formatDate } from '../date/formatDate.js'
import { FormattedBankData, DataType } from './bankInfoTypes.js'
import { cleanNumber } from './cleanNumber.js'

export function extractExpensesAndIncomes(dataRow: HTMLTableRowElement) {
  console.log('Processing Row:', dataRow.innerText)
  let cellsInRow = Array.from(dataRow.cells)
  console.log(
    'Cells in Row:',
    cellsInRow.map((cell) => cell.innerText),
  )

  if (isRowEmpty(cellsInRow)) return undefined

  const newData = {} as FormattedBankData

  newData.date = extractRowDate(cellsInRow)

  cellsInRow = cellsInRow.slice(1) // Remove date cell from further processing

  const [description, remainingCells] = extractDescription(cellsInRow)
  newData.name = description

  cellsInRow = remainingCells

  const expenseAmount = cleanNumber(cellsInRow[0]?.innerText)

  if (expenseAmount !== undefined) {
    newData.amount = expenseAmount
    newData.type = DataType.EXPENSE
    return newData
  }

  newData.type = DataType.INCOME
  const incomeAmount = cellsInRow
    .slice(1) // Skip first cell as it's already checked for expense
    .map((cell) => cleanNumber(cell.innerText))
    .find((amount) => amount !== undefined)

  newData.amount = incomeAmount || 0

  return newData
}

function extractDescription(cells: HTMLTableCellElement[]): [string, HTMLTableCellElement[]] {
  // Find first non-empty cell (start of description)
  const descriptionStartIndex = cells.findIndex((cell) => cell.innerText.trim())

  if (descriptionStartIndex === -1) {
    return ['', cells]
  }

  // Regex to match amount numbers like $123.45, -$1,234.56, 2500.00, 15.50, etc.
  const amountRegex = /^[-−]?\$?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d+$/

  // Find the amount cell starting from the description
  let amountIndex = -1
  for (let i = descriptionStartIndex; i < cells.length; i++) {
    if (amountRegex.test(cells[i].innerText.trim())) {
      amountIndex = i
      break
    }
  }

  // If amount found, description spans from start to (but not including) amount
  // Check if there's an empty cell before the amount and preserve it
  // Otherwise, take all non-empty cells from start to last non-empty cell
  let endIndex: number
  if (amountIndex !== -1) {
    // Check if cell before amount is empty
    if (
      amountIndex > descriptionStartIndex &&
      (!cells[amountIndex - 1].innerText.trim() ||
        cells[amountIndex - 1].innerText.trim() === 'Not applicable') // This is a cibc edge case
    ) {
      endIndex = amountIndex - 1 // Stop before the empty cell
    } else {
      endIndex = amountIndex
    }
  } else {
    // Find the last non-empty cell
    let lastNonEmptyIndex = descriptionStartIndex
    for (let i = cells.length - 1; i >= descriptionStartIndex; i--) {
      if (cells[i].innerText.trim()) {
        lastNonEmptyIndex = i
        break
      }
    }
    endIndex = lastNonEmptyIndex + 1
  }

  // Combine all text from start to end
  const description = cells
    .slice(descriptionStartIndex, endIndex)
    .map((cell) => cell.innerText.trim())
    .filter((text) => text)
    .join(' ')

  const remainingCells = cells.slice(endIndex)

  return [description, remainingCells]
}

function isRowEmpty(cells: HTMLTableCellElement[]): boolean {
  const isAnyCellWithText = cells.some((cell) => cell.innerText.trim() !== '')
  return !isAnyCellWithText
}

function extractRowDate(cells: HTMLTableCellElement[]): string | undefined {
  let newDate: string | undefined

  try {
    newDate = formatDate(cells[0].innerText, DateFormat.YYYY_MM_DD)
  } catch {
    newDate = undefined
  }
  return newDate
}
