import { describe, expect, it } from 'vitest'
import type { Income, NewIncome } from '@/types/income/income'
import { createStoreIncomeDuplicates } from '../storeIncomeDuplicates'

const fakeExistingIncome: Income = {
  id: 'income-existing-1',
  userId: 'user-1',
  accountId: 'account-1',
  date: '2026-01-15',
  name: 'Salary',
  amount: 1000,
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-01-15'),
}

describe('when income duplicates are tracked', () => {
  it('should detect duplicates across new draft incomes', () => {
    const storeIncomeDuplicates = createStoreIncomeDuplicates()
    const fakeDraftIncomes: NewIncome[] = [
      {
        date: '2026-01-15',
        name: 'Salary',
        amount: 1000,
      },
      {
        date: '2026-01-15',
        name: ' salary ',
        amount: 1000,
      },
    ]

    storeIncomeDuplicates.rebuildIncomeDuplicates(fakeDraftIncomes)

    expect(storeIncomeDuplicates.incomeDuplicates.value).toHaveLength(2)
    expect(storeIncomeDuplicates.incomeDuplicates.value[0].isPresentInNew).toBe(true)
    expect(storeIncomeDuplicates.incomeDuplicates.value[0].isPresentInExisting).toBe(false)
  })

  it('should denote duplicates from both new and existing sources', () => {
    const storeIncomeDuplicates = createStoreIncomeDuplicates()
    const fakeDraftIncomes: NewIncome[] = [
      {
        date: '2026-01-15',
        name: 'Salary',
        amount: 1000,
      },
      {
        date: '2026-01-15',
        name: 'Salary',
        amount: 1000,
      },
    ]

    storeIncomeDuplicates.syncExistingIncomes([fakeExistingIncome])
    storeIncomeDuplicates.rebuildIncomeDuplicates(fakeDraftIncomes)

    const duplicateEntry = storeIncomeDuplicates.incomeDuplicates.value[0]

    expect(duplicateEntry.isPresentInNew).toBe(true)
    expect(duplicateEntry.isPresentInExisting).toBe(true)
    expect(duplicateEntry.matches.some((match) => match.source === 'new')).toBe(true)
    expect(duplicateEntry.matches.some((match) => match.source === 'existing')).toBe(true)
  })

  it('should remove duplicate entries when edited row no longer matches', () => {
    const storeIncomeDuplicates = createStoreIncomeDuplicates()
    const fakeDraftIncomes: NewIncome[] = [
      {
        date: '2026-01-15',
        name: 'Salary',
        amount: 1000,
      },
      {
        date: '2026-01-15',
        name: 'Salary',
        amount: 1000,
      },
    ]

    storeIncomeDuplicates.rebuildIncomeDuplicates(fakeDraftIncomes)
    expect(storeIncomeDuplicates.incomeDuplicates.value).toHaveLength(2)

    fakeDraftIncomes[1] = {
      ...fakeDraftIncomes[1],
      name: 'Bonus',
    }

    storeIncomeDuplicates.recheckDraftIncomeRow(1, fakeDraftIncomes)

    expect(storeIncomeDuplicates.incomeDuplicates.value).toHaveLength(0)
  })

  it('should ignore incomplete draft incomes from duplicate checks', () => {
    const storeIncomeDuplicates = createStoreIncomeDuplicates()
    const fakeDraftIncomes: NewIncome[] = [
      {
        date: '2026-01-15',
        name: '',
        amount: 1000,
      },
      {
        date: '2026-01-15',
        name: '',
        amount: 1000,
      },
    ]

    storeIncomeDuplicates.rebuildIncomeDuplicates(fakeDraftIncomes)

    expect(storeIncomeDuplicates.incomeDuplicates.value).toHaveLength(0)
  })
})
