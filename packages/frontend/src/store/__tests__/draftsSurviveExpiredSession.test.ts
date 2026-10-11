import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { render } from '@testing-library/vue'
import { createStore, getStore } from '../store'
import { getCategories } from '@/service/categories/getCategories'
import { getExpenses } from '@/service/expenses/getExpenses'
import { getAllIncomes } from '@/service/income/getAllIncomes'
import type { NewExpense } from '@/types/expenseData'
import type { NewIncome } from '@/types/income/income'
import AddDataView from '@/views/AddDataView.vue'

vi.mock('@/service/categories/getCategories', () => ({ getCategories: vi.fn() }))
vi.mock('@/service/expenses/getExpenses', () => ({ getExpenses: vi.fn() }))
vi.mock('@/service/income/getAllIncomes', () => ({ getAllIncomes: vi.fn() }))

const draftExpense: NewExpense = {
  date: '2026-01-10',
  name: 'Coffee',
  amount: 5,
  netAmount: 5,
  paidBackAmount: 0,
  category: '',
  subCategory: '',
}

const draftIncome: NewIncome = {
  date: '2026-01-11',
  name: 'Salary',
  amount: 1000,
}

describe('when the session expires and the user refreshes before logging back in', () => {
  const mockGetCategories = vi.mocked(getCategories)
  const mockGetExpenses = vi.mocked(getExpenses)
  const mockGetAllIncomes = vi.mocked(getAllIncomes)

  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    localStorage.setItem('spendtrend_new_expenses', JSON.stringify([draftExpense]))
    localStorage.setItem('spendtrend_new_incomes', JSON.stringify([draftIncome]))
  })

  it('should keep unsaved draft expenses and incomes after logging back in', async () => {
    // Boot 1: refresh with an expired session, landing on the add data page
    const notAuthenticated = new Error('User not authenticated')
    mockGetCategories.mockRejectedValue(notAuthenticated)
    mockGetExpenses.mockRejectedValue(notAuthenticated)
    mockGetAllIncomes.mockRejectedValue(notAuthenticated)
    await createStore()
    const { unmount } = render(AddDataView)
    await flushPromises()
    unmount()

    // Boot 2: user logs back in and the app boots with a valid session
    mockGetCategories.mockResolvedValue([])
    mockGetExpenses.mockResolvedValue([])
    mockGetAllIncomes.mockResolvedValue([])
    await createStore()

    expect(getStore().newExpenses.value).toEqual([draftExpense])
    expect(getStore().newIncomes.value).toEqual([draftIncome])
  })
})
