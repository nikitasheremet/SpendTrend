import { test, expect } from '@playwright/test'
import { STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { incomeTable } from '../src/db/schema'
import crypto from 'crypto'

const BASE_URL = 'http://localhost:3000'

test.describe('Get Incomes Endpoint', () => {
  let fakeIncomeData1: any
  let fakeIncomeData2: any
  let fakeIncomeDataDifferentAccount: any
  let fakeAccountId: string

  test.beforeAll(async () => {
    connectToDb()
    const { accountId, incomeData1, incomeData2, incomeDataDifferentAccount } =
      await assignFakeIncomeData()
    fakeAccountId = accountId
    fakeIncomeData1 = incomeData1
    fakeIncomeData2 = incomeData2
    fakeIncomeDataDifferentAccount = incomeDataDifferentAccount
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      // Missing or invalid userId
      const response = await request.get(`${BASE_URL}/incomes`, {
        params: { userId: '' },
      })
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when get incomes is called successfully', () => {
    test('should return an array of incomes related to the account id provided in descending order based on date', async ({
      request,
    }) => {
      // Insert test incomes directly into database
      const [income1] = await db.insert(incomeTable).values(fakeIncomeData1).returning()
      const [income2] = await db.insert(incomeTable).values(fakeIncomeData2).returning()
      await db.insert(incomeTable).values(fakeIncomeDataDifferentAccount)

      // Get incomes
      const response = await request.get(`${BASE_URL}/incomes`, {
        params: { userId: fakeIncomeData1.userId, accountId: fakeAccountId },
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body).toHaveProperty('incomes')

      // Only 2 incomes that match the account id are returned
      expect(body.incomes.length).toEqual(2)

      // Verify the created incomes are in the response and in correct order (date descending)
      const returnedIncomes = body.incomes
      expect(returnedIncomes[0]).toEqual({
        ...income2,
        createdAt: fakeIncomeData2.createdAt.toISOString(),
        updatedAt: fakeIncomeData2.updatedAt.toISOString(),
      })

      expect(returnedIncomes[1]).toEqual({
        ...income1,
        createdAt: fakeIncomeData1.createdAt.toISOString(),
        updatedAt: fakeIncomeData1.updatedAt.toISOString(),
      })
    })
  })
})

async function assignFakeIncomeData(): Promise<{
  accountId: string
  incomeData1: any
  incomeData2: any
  incomeDataDifferentAccount: any
}> {
  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

  const fakeIncomeData1 = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Salary',
    amount: 1000,
    date: '2025-08-07',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const fakeIncomeData2 = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    name: 'Bonus',
    amount: 500,
    date: '2025-08-08',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const fakeAccountId2 = '00000000-0000-0000-0000-000000000004'

  const fakeIncomeDataDifferentAccount = {
    userId: fakeUserId,
    accountId: fakeAccountId2,
    name: 'Freelance',
    amount: 200,
    date: '2025-08-09',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return {
    accountId: fakeAccountId,
    incomeData1: fakeIncomeData1,
    incomeData2: fakeIncomeData2,
    incomeDataDifferentAccount: fakeIncomeDataDifferentAccount,
  }
}
