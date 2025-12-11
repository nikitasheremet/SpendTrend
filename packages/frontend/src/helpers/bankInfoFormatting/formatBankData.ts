import { DateFormat, formatDate } from '../date/formatDate'

export enum DataType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export interface FormattedBankData {
  type: DataType
  date?: string
  name: string
  amount: number
}

export function formatBankData(bankData: string): FormattedBankData[] {
  const splitData = bankData.split(/([\t\n]+)/)
  console.log('Split data:', splitData)
  const rows: string[][] = []
  let nextRow: string[] = []
  const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/

  for (let i = 0; i < splitData.length; i++) {
    const isValidDate = regex.test(splitData[i])
    const isNextRowFilled = Boolean(nextRow.length)
    if (isValidDate) {
      if (isNextRowFilled) {
        rows.push(nextRow)
        nextRow = [splitData[i]]
      } else {
        nextRow.push(splitData[i])
      }
    } else {
      nextRow.push(splitData[i])
    }
    // This is the last row
    if (i === splitData.length - 1) {
      rows.push(nextRow)
    }
  }
  console.log('Parsed rows:', rows)
  const createdData = rows.map((row) => {
    const lastRowCell = row[row.length - 1]
    const newData: {
      date: string
      name: string
      amount: number
      type: DataType
    } = {
      date: '',
      name: '',
      amount: 0,
      type: DataType.EXPENSE,
    }
    newData.date = formatDate(new Date(row[0] as string), DateFormat.YYYY_MM_DD)
    const indexOfFirstAmount = row.findIndex((cell) => (cell as string).includes('$'))
    if (indexOfFirstAmount < 0) {
      throw new Error('NO AMOUNT PRESENT IN ROW')
    }
    const dataDescription = row
      .slice(1, indexOfFirstAmount)
      .join(' ')
      .replaceAll(/([\t\n]+)/g, '')
      .trim()
    newData.name = dataDescription
    const dataAmount = (row[indexOfFirstAmount] as string)
      .replace('$', '')
      .replace(',', '')
      .replace('−', '-') // This is because CIBC somehow uses a different minus sign character
    newData.amount = parseFloat(dataAmount)
    const indexOfSecondAmount = row.findLastIndex((cell) => (cell as string).includes('$'))
    const isThereTwoAmounts = indexOfSecondAmount > indexOfFirstAmount
    const isRbcData = row[1] === '\t\n'
    const isCIBCCreditCardData = newData.name === newData.name.toUpperCase() && !isThereTwoAmounts
    const isCIBCDebitData = row.join().includes('Not applicable') && isThereTwoAmounts
    const isCIBCData = isCIBCCreditCardData || isCIBCDebitData

    if (isCIBCData) {
      if (isCIBCDebitData) {
        const indexOfNotApplicableText = row.findIndex((cell) =>
          (cell as string).includes('Not applicable'),
        )
        if (indexOfFirstAmount < indexOfNotApplicableText) {
          newData.type = DataType.EXPENSE
        } else {
          newData.type = DataType.INCOME
        }
      } else {
        if (newData.amount < 0) {
          newData.type = DataType.EXPENSE
        } else {
          newData.type = DataType.INCOME
        }
      }
    }

    if (isRbcData) {
      if (newData.amount < 0) {
        if (lastRowCell.includes('\t\t\t') || isThereTwoAmounts) {
          newData.type = DataType.EXPENSE
        } else {
          newData.type = DataType.INCOME
        }
      }
      if (newData.amount > 0) {
        if (isThereTwoAmounts) {
          newData.type = DataType.INCOME
        } else {
          newData.type = DataType.EXPENSE
        }
      }
    }

    return newData
  })
  return createdData
}
