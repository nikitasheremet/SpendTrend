import { formatPastedBankData } from '@/helpers/bankInfoFormatting/formatPastedBankData'
import { DataType } from '@/helpers/bankInfoFormatting/bankInfoTypes'
import { scramblePaste } from '../scramblePaste'
import {
  DEBIT_CREDIT_TABLE_PASTE,
  NOT_APPLICABLE_PASTE,
  PERCENTAGE_PASTE,
  TYPICAL_BANK_PASTES,
} from './bankPasteFixtures'

// Always picks the first option: digits become 1, letters become a/A.
const lowestRandom = () => 0
// Always picks the last option: digits become 9, letters become z/Z.
const highestRandom = () => 0.99
const TWO_MB = 2 * 1024 * 1024

// jsdom doesn't implement innerText, which the parser reads from every cell.
const originalInnerText = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText')
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    configurable: true,
    get(this: HTMLElement) {
      return this.textContent ?? ''
    },
    set(this: HTMLElement, value: string) {
      this.textContent = value
    },
  })
})
afterAll(() => {
  if (originalInnerText) {
    Object.defineProperty(HTMLElement.prototype, 'innerText', originalInnerText)
  } else {
    delete (HTMLElement.prototype as { innerText?: string }).innerText
  }
})

function scramble(html: string, random: () => number = lowestRandom, text = '') {
  return scramblePaste({ html, text, parsedRows: formatPastedBankData(html) }, random)
}

function cellTexts(html: string): string[][] {
  const document = new DOMParser().parseFromString(html, 'text/html')
  return Array.from(document.querySelectorAll('tr')).map((row) =>
    Array.from(row.cells).map((cell) => cell.textContent ?? ''),
  )
}

describe('scramblePaste', () => {
  describe('digits', () => {
    it('should turn digits 1–9 into random digits 1–9 and keep zeros and number punctuation', () => {
      const { scrambledHtml } = scramble(DEBIT_CREDIT_TABLE_PASTE)

      expect(cellTexts(scrambledHtml).slice(0, 3)).toEqual([
        ['Jan 15, 2026', 'Aaaaaaa Aaaaa', '$10.00', '', '$1,111.11'],
        ['Jan 16, 2026', 'Aaaaaa', '', '1100.00', '1,111.11'],
        ['Jan 17, 2026', 'Aaaaaa Aaaa', '$1.11$0.01', '', ''],
      ])
    })

    it('should take each digit from the random source', () => {
      const { scrambledHtml } = scramble(DEBIT_CREDIT_TABLE_PASTE, highestRandom)

      expect(cellTexts(scrambledHtml)[0]).toEqual([
        'Jan 15, 2026',
        'Zzzzzzz Zzzzz',
        '$90.00',
        '',
        '$9,999.99',
      ])
    })

    it('should keep minus signs and percent signs', () => {
      const { scrambledHtml } = scramble(`${NOT_APPLICABLE_PASTE}${PERCENTAGE_PASTE}`)

      const rows = cellTexts(scrambledHtml)
      expect(rows[1][6]).toBe('−$11.00')
      expect(rows[2][1]).toBe(
        '0.1%AAA AAAAAAA #1111 AAAAAAA AAAaaa Aaaa (Aaaaa Aaaaaaa)aaaa aaaaaa',
      )
    })
  })

  describe('letters', () => {
    it('should turn letters into random letters of the same case', () => {
      const { scrambledHtml } = scramble(PERCENTAGE_PASTE, highestRandom)

      expect(cellTexts(scrambledHtml)[0][1]).toBe(
        '0.9%ZZZ ZZZZZZZ #9999 ZZZZZZZ ZZZzzz Zzzz (Zzzzz Zzzzzzz)zzzz zzzzzz',
      )
    })

    it('should scramble accented letters too', () => {
      const { scrambledHtml } = scramble('<table><tr><td>Café Éclair</td><td></td></tr></table>')

      expect(cellTexts(scrambledHtml)[0][0]).toBe('Aaaa Aaaaaa')
    })
  })

  describe('allowlist', () => {
    it('should keep column words', () => {
      const columnWords = 'Date Description Debit Credit Withdrawal Deposit Balance Amount'
      const { scrambledHtml } = scramble(`<p>${columnWords} Coffee</p>`)

      expect(scrambledHtml).toContain(`<p>${columnWords} Aaaaaa</p>`)
    })

    it('should keep Not applicable', () => {
      const { scrambledHtml } = scramble(NOT_APPLICABLE_PASTE)

      expect(cellTexts(scrambledHtml)[0][2]).toBe('Not applicable')
    })

    it('should keep month names and abbreviations as whole words only', () => {
      const { scrambledHtml } = scramble(
        '<table><tr><td>Paid in September</td><td>Dec rent</td><td>Janet</td><td></td></tr></table>',
      )

      expect(cellTexts(scrambledHtml)[0]).toEqual(['Aaaa aa September', 'Dec aaaa', 'Aaaaa', ''])
    })
  })

  describe('dates', () => {
    it.each([
      'Jan 15, 2026',
      'January 15, 2026',
      'Sept. 3, 2026',
      'December 172025',
      '15 Jan 2026',
      '2026-01-15',
      '01/15/2026',
    ])('should keep %s as it is', (date) => {
      const { scrambledHtml, scrambledText } = scramble(
        `<table><tr><td>${date}</td><td></td></tr></table>`,
        highestRandom,
        `${date}\tCoffee`,
      )

      expect(cellTexts(scrambledHtml)[0][0]).toBe(date)
      expect(scrambledText).toBe(`${date}\tZzzzzz`)
    })

    it('should scramble numbers that only look like dates to a lenient date parser', () => {
      const { scrambledHtml } = scramble(
        '<table><tr><td>15.50</td><td>Store 42</td><td></td></tr></table>',
      )

      expect(cellTexts(scrambledHtml)[0]).toEqual(['11.10', 'Aaaaa 11', ''])
    })
  })

  describe('whitespace and empty cells', () => {
    it('should keep whitespace and which cells are empty', () => {
      const { scrambledHtml } = scramble(
        '<table><tr><td>  Coffee  Shop </td><td></td><td> </td><td>\n</td></tr></table>',
      )

      expect(cellTexts(scrambledHtml)[0]).toEqual(['  Aaaaaa  Aaaa ', '', ' ', '\n'])
    })
  })

  describe('attributes', () => {
    it('should remove every attribute except colspan and rowspan', () => {
      const { scrambledHtml } = scramble(`${DEBIT_CREDIT_TABLE_PASTE}${PERCENTAGE_PASTE}`)

      const document = new DOMParser().parseFromString(scrambledHtml, 'text/html')
      const attributeNames = Array.from(document.querySelectorAll('*')).flatMap((element) =>
        element.getAttributeNames(),
      )
      expect(new Set(attributeNames)).toEqual(new Set(['colspan', 'rowspan']))
      expect(scrambledHtml).toContain('colspan="5"')
      expect(scrambledHtml).toContain('rowspan="2"')
      expect(scrambledHtml).not.toMatch(/1234-5678|#4471|txn-1|bank\.example|9981/)
    })

    it('should remove comments and template contents, which could hold unscrambled text', () => {
      const { scrambledHtml } = scramble(
        '<table><tr><td>Coffee</td><td></td></tr></table><!-- Card 4520 --><template><p>Secret</p></template>',
      )

      expect(scrambledHtml).not.toMatch(/4520|Secret|template/)
    })
  })

  describe('plain text', () => {
    it('should scramble plain text with the same rules', () => {
      const { scrambledText } = scramble(
        '',
        lowestRandom,
        'Date\tDescription\tDebit\nJan 15, 2026\tGrocery Store\t$1,234.50\n\nNot applicable  ',
      )

      expect(scrambledText).toBe(
        'Date\tDescription\tDebit\nJan 15, 2026\tAaaaaaa Aaaaa\t$1,111.10\n\nNot applicable  ',
      )
    })
  })

  describe('parsed rows', () => {
    it('should come from parsing the scrambled HTML', () => {
      const { parsedRows } = scramble(DEBIT_CREDIT_TABLE_PASTE)

      expect(parsedRows).toEqual([
        { date: '2026-01-15', name: 'Aaaaaaa Aaaaa', type: DataType.EXPENSE, amount: 10 },
        { date: '2026-01-16', name: 'Aaaaaa', type: DataType.INCOME, amount: 1100 },
        { date: '2026-01-17', name: 'Aaaaaa Aaaa', type: DataType.EXPENSE, amount: 1.11 },
      ])
    })

    it('should be empty when there was no HTML on the clipboard', () => {
      const result = scramble('', lowestRandom, 'Coffee')

      expect(result.scrambledHtml).toBe('')
      expect(result.parsedRows).toEqual([])
    })
  })

  describe('fidelity check', () => {
    it.each(
      TYPICAL_BANK_PASTES.flatMap(([name, html]) => [
        [name, 'lowest', html, lowestRandom] as const,
        [name, 'highest', html, highestRandom] as const,
      ]),
    )('should match on a paste with %s (%s random digits)', (_name, _random, html, random) => {
      const { fidelity } = scramble(html, random)

      expect(fidelity.matches).toBe(true)
      expect(fidelity.scrambled).toEqual(fidelity.original)
    })

    it('should count rows, expenses, incomes and rows with no date', () => {
      const { fidelity } = scramble(DEBIT_CREDIT_TABLE_PASTE)

      expect(fidelity).toEqual({
        original: { rowCount: 3, expenseCount: 2, incomeCount: 1, rowsWithoutDate: 0 },
        scrambled: { rowCount: 3, expenseCount: 2, incomeCount: 1, rowsWithoutDate: 0 },
        matches: true,
      })
    })

    it('should not match when scrambling changes how the paste parses', () => {
      // A date split across elements isn't recognised as a date, so its day becomes 99.
      const { fidelity } = scramble(
        '<table><tr><td><span>Jan</span> <span>15, 2026</span></td><td>Coffee</td><td>$5.00</td></tr></table>',
        highestRandom,
      )

      expect(fidelity).toEqual({
        original: { rowCount: 1, expenseCount: 1, incomeCount: 0, rowsWithoutDate: 0 },
        scrambled: { rowCount: 1, expenseCount: 1, incomeCount: 0, rowsWithoutDate: 1 },
        matches: false,
      })
    })
  })

  describe('truncation', () => {
    it('should not be truncated for a typical paste', () => {
      expect(scramble(DEBIT_CREDIT_TABLE_PASTE, lowestRandom, 'Coffee').isTruncated).toBe(false)
    })

    it('should cut HTML down to 2 MB and say it was truncated', () => {
      const hugeHtml = `<table><tr><td>Jan 15, 2026</td><td>${'Coffee '.repeat(400_000)}</td><td></td></tr></table>`

      const { scrambledHtml, isTruncated, parsedRows, fidelity } = scramble(hugeHtml)

      expect(new TextEncoder().encode(scrambledHtml).length).toBeLessThanOrEqual(TWO_MB)
      expect(new TextEncoder().encode(scrambledHtml).length).toBeGreaterThan(TWO_MB - 100)
      expect(isTruncated).toBe(true)
      // The cut row is one the parser can't read, which the fidelity check shows.
      expect(parsedRows).toEqual([])
      expect(fidelity.matches).toBe(false)
    })

    it('should cut plain text down to 2 MB without splitting a character', () => {
      const { scrambledText, isTruncated } = scramble('', lowestRandom, '−'.repeat(TWO_MB))

      expect(new TextEncoder().encode(scrambledText).length).toBeLessThanOrEqual(TWO_MB)
      expect(scrambledText).toMatch(/^−+$/)
      expect(isTruncated).toBe(true)
    })
  })
})
