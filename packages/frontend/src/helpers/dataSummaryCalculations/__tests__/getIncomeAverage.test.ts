import { describe, expect, it } from 'vitest'
import { getIncomeAverage } from '../getIncomeAverage'
import type { Income } from '@/types/income/income'

const fakeDate = new Date('2026-01-01T00:00:00.000Z')

function createFakeIncome(date: string, amount: number): Income {
  return {
    id: `${date}-${amount}`,
    userId: 'user-id',
    accountId: 'account-id',
    name: 'fake-income',
    amount,
    date,
    createdAt: fakeDate,
    updatedAt: fakeDate,
  }
}

describe('when calculating income average for sparse months', () => {
  it('should divide by 1 when only one month has a total greater than 0', () => {
    const fakeIncomes = [createFakeIncome('2026-03-05', 300)]

    const result = getIncomeAverage(fakeIncomes, 3, 2026, 3)

    expect(result).toBe(300)
  })

  it('should divide by 2 when two months have totals greater than 0', () => {
    const fakeIncomes = [createFakeIncome('2026-03-05', 100), createFakeIncome('2026-01-07', 200)]

    const result = getIncomeAverage(fakeIncomes, 3, 2026, 3)

    expect(result).toBe(150)
  })

  it('should return 0 when no prior month has a total greater than 0', () => {
    const fakeIncomes = [createFakeIncome('2026-03-05', 0)]

    const result = getIncomeAverage(fakeIncomes, 3, 2026, 3)

    expect(result).toBe(0)
  })

  it('should handle year boundary for prior-month lookback', () => {
    const fakeIncomes = [
      createFakeIncome('2025-12-05', 100),
      createFakeIncome('2025-11-07', 200),
      createFakeIncome('2025-10-12', 0),
    ]

    const result = getIncomeAverage(fakeIncomes, 0, 2026, 3)

    expect(result).toBe(150)
  })
})
