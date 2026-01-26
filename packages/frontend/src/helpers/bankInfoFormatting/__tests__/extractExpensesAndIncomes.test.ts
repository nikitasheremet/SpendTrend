import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { extractExpensesAndIncomes } from '../extractExpensesAndIncomes.js'
import { DataType } from '../bankInfoTypes.js'

describe('extractExpensesAndIncomes', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    // consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy.mockRestore()
    // consoleLogSpy.mockRestore()
  })

  function createFakeRow(cellTexts: string[]): HTMLTableRowElement {
    const fakeRow = document.createElement('tr')
    cellTexts.forEach((text) => {
      const fakeCell = document.createElement('td')
      fakeCell.innerText = text
      fakeRow.appendChild(fakeCell)
    })
    return fakeRow
  }

  describe('when all cells are empty', () => {
    it('should return undefined', () => {
      const fakeRow = createFakeRow(['', '', '', ''])

      const result = extractExpensesAndIncomes(fakeRow)

      expect(result).toBeUndefined()
    })
  })

  describe('extract date', () => {
    describe('when date parsing succeeds', () => {
      it('should set the date field with formatted date', () => {
        const fakeRow = createFakeRow(['Jan 15, 2026', 'Coffee Shop', '15.50', '', ''])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.date).toBe('2026-01-15')
      })
    })

    describe('when date parsing fails', () => {
      it('should set date to undefined', () => {
        const fakeRow = createFakeRow(['Invalid Date', 'Coffee Shop', '15.50', '', ''])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.date).toBeUndefined()
      })
    })
  })
  describe('extracting description', () => {
    describe('when description is in the second cell', () => {
      it('should extract the description correctly', () => {
        const fakeRow = createFakeRow(['Jan 15, 2026', 'Grocery Store', '$50.00', '', ''])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.name).toBe('Grocery Store')
      })
    })

    describe('when description is in a later cell after empty cells', () => {
      it('should extract the description correctly', () => {
        const fakeRow = createFakeRow(['Jan 15, 2026', '', '', 'Restaurant', '$25.00', ''])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.name).toBe('Restaurant')
      })
    })

    describe('when description is split across multiple cells', () => {
      it('should combine all text cells before the expense amount', () => {
        const fakeRow = createFakeRow(['Jan 15, 2026', '', '', 'Coffee', 'Shop', '$15.50', ''])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.name).toBe('Coffee Shop')
      })
    })

    describe('when description spans with empty cells in between', () => {
      it('should combine only non-empty text cells', () => {
        const fakeRow = createFakeRow([
          'Jan 15, 2026',
          '',
          'Local',
          '',
          'Grocery',
          'Store',
          '$75.00',
        ])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.name).toBe('Local Grocery Store')
      })
    })

    describe('when no expense pattern is found', () => {
      it('should take only the first non-empty cell as description', () => {
        const fakeRow = createFakeRow(['Jan 15, 2026', '', 'Description', 'More Text', ''])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.name).toBe('Description More Text')
      })
    })

    describe('when "Not applicable" appears before an amount', () => {
      it('should exclude "Not applicable" from the description', () => {
        const fakeRow = createFakeRow([
          'Jan 15, 2026',
          'Coffee Shop',
          'Not applicable',
          '$15.50',
          '',
        ])

        const result = extractExpensesAndIncomes(fakeRow)

        expect(result?.name).toBe('Coffee Shop')
        expect(result?.amount).toBe(15.5)
        expect(result?.type).toBe(DataType.INCOME)
      })
    })
  })

  describe('when expense amount is present', () => {
    it('should set type to EXPENSE and extract amount', () => {
      const fakeRow = createFakeRow(['Jan 15, 2026', 'Coffee Shop', '15.50', '', ''])

      const result = extractExpensesAndIncomes(fakeRow)

      expect(result?.type).toBe(DataType.EXPENSE)
      expect(result?.amount).toBe(15.5)
    })
  })

  describe('when expense amount is not present (income case)', () => {
    it('should set type to INCOME and extract first amount from remaining cells', () => {
      const fakeRow = createFakeRow(['Jan 15, 2026', 'Salary', '', '2500.00', '100.00'])

      const result = extractExpensesAndIncomes(fakeRow)

      expect(result?.type).toBe(DataType.INCOME)
      expect(result?.amount).toBe(2500)
    })

    it('should find amount in the first available cell after expense column', () => {
      const fakeRow = createFakeRow(['Jan 15, 2026', 'Freelance', '', '', '500.00'])

      const result = extractExpensesAndIncomes(fakeRow)

      expect(result?.type).toBe(DataType.INCOME)
      expect(result?.amount).toBe(500)
    })
  })

  describe('when no income amount is found', () => {
    it('should set amount to 0', () => {
      const fakeRow = createFakeRow(['Jan 15, 2026', 'No Amount', '', '', ''])

      const result = extractExpensesAndIncomes(fakeRow)

      expect(result?.type).toBe(DataType.INCOME)
      expect(result?.amount).toBe(0)
    })
  })

  describe('when description is not found', () => {
    it('should return an empty string and the same cells that were passed into it', () => {
      const fakeRow = createFakeRow(['Jan 15, 2026', '', '', ''])

      const result = extractExpensesAndIncomes(fakeRow)

      expect(result?.name).toBe('')
      expect(result?.type).toBe(DataType.INCOME)
      expect(result?.amount).toBe(0)
    })
  })
})
