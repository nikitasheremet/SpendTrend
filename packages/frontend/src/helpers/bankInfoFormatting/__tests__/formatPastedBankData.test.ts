import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatPastedBankData } from '../formatPastedBankData.js'
import { extractExpensesAndIncomes } from '../extractExpensesAndIncomes.js'
import { DataType } from '../bankInfoTypes.js'

vi.mock('../extractExpensesAndIncomes.js', () => ({
  extractExpensesAndIncomes: vi.fn(),
}))

const mockExtractExpensesAndIncomes = vi.mocked(extractExpensesAndIncomes)

describe('formatPastedBankData', () => {
  beforeEach(() => {
    mockExtractExpensesAndIncomes.mockImplementation((row: HTMLTableRowElement) => {
      const text = row.textContent?.trim()
      if (!text) return undefined
      return {
        type: DataType.EXPENSE,
        name: text,
        amount: 100,
      }
    })
  })

  describe('when valid HTML table data is pasted', () => {
    it('should return income and expense data', () => {
      const fakeHtml = `
        <div>
          <table>
            <tbody>
              <tr><td>Row 1</td><td>Data</td></tr>
              <tr><td></td></tr>
              <tr><td>Row 2</td><td>Data</td></tr>
            </tbody>
          </table>
        </div>
      `

      const result = formatPastedBankData(fakeHtml)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Row 1Data')
      expect(result[1].name).toBe('Row 2Data')
    })

    it('should sanitize HTML by removing style and class attributes', () => {
      const fakeHtml = `
        <script>throw new Error('XSS should be stripped');</script>
        <table style="border: 1px solid black;" class="my-table">
          <tr style="color: red;" class="row-class">
            <td style="padding: 10px;" class="cell-class">Styled Row Data</td>
          </tr>
        </table>
      `

      const result = formatPastedBankData(fakeHtml)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Styled Row Data')
    })
  })

  describe('when empty HTML is pasted', () => {
    it('should return an empty array', () => {
      const fakeHtml = ''

      const result = formatPastedBankData(fakeHtml)

      expect(result).toEqual([])
    })
  })
})
