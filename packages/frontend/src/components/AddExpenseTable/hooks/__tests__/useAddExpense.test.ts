import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useAddExpense } from '../useAddExpense'
import { addNewExpense } from '@/service/expenses/addNewExpense'
import { formatDate, DateFormat } from '@/helpers/date/formatDate'
import type { NewExpense } from '@/types/expenseData'
import { nextTick } from 'vue'

vi.mock('@/service/expenses/addNewExpense')

describe('useAddExpense', () => {
  const mockAddNewExpense = vi.mocked(addNewExpense)

  const expectedEmptyNewExpense: NewExpense = {
    date: formatDate(new Date(), DateFormat.YYYY_MM_DD),
    name: '',
    netAmount: 0,
    amount: 0,
    paidBackAmount: 0,
    category: '',
    subCategory: '',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when hook is called', () => {
    it('should return expected object with initial values', () => {
      const { newExpenseData, addExpense, error } = useAddExpense()

      expect(newExpenseData.value).toEqual(expectedEmptyNewExpense)
      expect(typeof addExpense).toBe('function')
      expect(error.value).toBeUndefined()
    })
  })

  describe('when amount and paidBackAmount are updated', () => {
    it('should automatically update netAmount correctly', async () => {
      const { newExpenseData } = useAddExpense()

      newExpenseData.value.amount = 100
      newExpenseData.value.paidBackAmount = 20
      await nextTick()

      expect(newExpenseData.value.netAmount).toBe(80)

      newExpenseData.value.amount = 50
      newExpenseData.value.paidBackAmount = 10
      await nextTick()

      expect(newExpenseData.value.netAmount).toBe(40)
    })
  })

  describe('when all fields are updated and addExpense is called', () => {
    it('should call addNewExpense with correct values and reset newExpenseData', async () => {
      const { newExpenseData, addExpense } = useAddExpense()

      const fakeUpdatedExpenseData: NewExpense = {
        ...newExpenseData.value,
        name: 'Cool New Expense',
      }
      newExpenseData.value = { ...fakeUpdatedExpenseData }

      await addExpense()

      expect(newExpenseData.value).toEqual(expectedEmptyNewExpense)
    })
  })

  describe('when date is set to empty string and addExpense is called', () => {
    it('should update the error object with validation error', async () => {
      const { newExpenseData, addExpense, error } = useAddExpense()

      newExpenseData.value.date = ''

      await addExpense()

      expect(error.value?.message).toBe('Date is required')
    })
  })

  describe('when addNewExpense throws an error', () => {
    it('should update the error object with the thrown error', async () => {
      const fakeError = new Error('Failed to add expense')
      mockAddNewExpense.mockRejectedValue(fakeError)

      const { newExpenseData, addExpense, error } = useAddExpense()

      newExpenseData.value.date = '2023-01-02'
      newExpenseData.value.name = 'Test'

      await addExpense()

      expect(error.value).toBe(fakeError)
    })
  })
})
