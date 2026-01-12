import { test, expect } from '@playwright/test'
import {
  // STATUS_CREATED_201,
  // STATUS_INTERNAL_SERVER_ERROR_500,
  STATUS_UNPROCESSABLE_ENTITY_422,
} from '../src/models/statusCodes'
import crypto from 'crypto'
// import { DB_ERROR } from '../src/models/errors/repositoryErrors'
import { connectToDb } from '../src/db'
import { CreateIncomesInput } from '../src/income/validation/models'

const BASE_URL = 'http://localhost:3000'

test.describe('Create Income Endpoint', () => {
  let fakeCreateIncomeInput: CreateIncomesInput

  test.beforeAll(async () => {
    const { createIncomeInput } = await assignFakeCreateIncomeInput()
    fakeCreateIncomeInput = createIncomeInput
  })

  test.describe('when required data fails validation', () => {
    test('should return error message and 422 status code', async ({ request }) => {
      const fakeBadValidationData = {}
      const response = await request.post(`${BASE_URL}/createincome`, {
        data: fakeBadValidationData,
      })
      const body = await response.json()
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      expect(body).toHaveProperty('error')
    })
  })

  // test.describe('when valid income data is provided', () => {
  //   test('should create new incomes and return flat arrays', async ({ request }) => {
  //     const response = await request.post(`${BASE_URL}/createincome`, {
  //       data: fakeCreateIncomeInput,
  //     })

  //     expect(response.status()).toBe(STATUS_CREATED_201)
  //     const body = await response.json()
  //     expect(Array.isArray(body.createdIncomes)).toBe(true)
  //     expect(Array.isArray(body.failedIncomes)).toBe(true)
  //     expect(body.failedIncomes).toHaveLength(0)
  //     expect(body.createdIncomes[0]).toEqual(
  //       expect.objectContaining({
  //         id: expect.any(String),
  //         name: fakeCreateIncomeInput.incomesToCreate[0].name,
  //         amount: expect.any(Number),
  //         date: fakeCreateIncomeInput.incomesToCreate[0].date,
  //         createdAt: expect.any(String),
  //         updatedAt: expect.any(String),
  //       }),
  //     )
  //     const createdIncome = await db.query.incomeTable.findFirst({
  //       where: (income, { eq }) => eq(income.id, body.createdIncomes[0].id),
  //     })
  //     expect(createdIncome).toEqual(expect.objectContaining({ id: body.createdIncomes[0].id }))
  //   })
  // })
})

async function assignFakeCreateIncomeInput(): Promise<{ createIncomeInput: CreateIncomesInput }> {
  connectToDb()

  const fakeAccountId = crypto.randomUUID()
  const fakeUserId = crypto.randomUUID()

  const createIncomeInput = {
    userId: fakeUserId,
    accountId: fakeAccountId,
    incomesToCreate: [
      {
        name: 'Salary',
        amount: 100,
        date: '2025-08-07',
      },
    ],
  }

  return { createIncomeInput }
}
