import { apiFailedIncomeToDomain, apiFailedIncomesToDomain } from '../failedIncomeApiToDomain'

describe('apiFailedIncomeToDomain', () => {
  describe('when mapping a single failed income', () => {
    it('should map input fields to domain format', () => {
      const fakeFailedIncome = {
        incomeInput: {
          name: 'Salary',
          amount: 1234.56,
          date: '2024-01-01',
        },
        errorMessage: 'Validation failed',
      }

      const result = apiFailedIncomeToDomain(fakeFailedIncome)

      expect(result).toEqual({
        incomeInput: {
          name: 'Salary',
          amount: 1234.56,
          date: '2024-01-01',
        },
        errorMessage: 'Validation failed',
      })
    })
  })

  describe('when mapping an array of failed incomes', () => {
    it('should map each item', () => {
      const fakeFailedIncomes = [
        {
          incomeInput: {
            name: 'Salary',
            amount: 1234.56,
            date: '2024-01-01',
          },
          errorMessage: 'Validation failed',
        },
      ]

      const result = apiFailedIncomesToDomain(fakeFailedIncomes)

      expect(result).toEqual([
        {
          incomeInput: {
            name: 'Salary',
            amount: 1234.56,
            date: '2024-01-01',
          },
          errorMessage: 'Validation failed',
        },
      ])
    })
  })
})
