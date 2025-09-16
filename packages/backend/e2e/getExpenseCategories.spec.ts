import { test, expect } from '@playwright/test'
import { STATUS_SUCCESS_200, STATUS_UNPROCESSABLE_ENTITY_422 } from '../src/models/statusCodes'
import { connectToDb, db } from '../src/db'
import { expenseCategoriesTable, expenseSubCategoriesTable } from '../src/db/schema'
import crypto from 'crypto'

const BASE_URL = 'http://localhost:3000'

test.describe('Get Expense Categories Endpoint', () => {
  test.beforeAll(() => {
    connectToDb()
  })
  test.describe('when invalid input is provided', () => {
    test('should return 422 status code and an error message', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/getexpensecategories`)
      expect(response.status()).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      const body = await response.json()
      expect(body).toHaveProperty('error')
    })
  })

  test.describe('when request is successful', () => {
    test('should return an array of expenseCategories with subcategories', async ({ request }) => {
      const fakeAccountId = crypto.randomUUID()
      const fakeUserId = crypto.randomUUID()

      // Create test data with 2 categories and their subcategories
      const testData = await createTestData(fakeUserId, fakeAccountId)

      // Get categories
      const response = await request.get(`${BASE_URL}/getexpensecategories`, {
        params: {
          userId: fakeUserId,
          accountId: fakeAccountId,
        },
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body).toHaveProperty('expenseCategories')
      expect(body.expenseCategories.length).toBe(2)

      // Assert queried data matches inserted data, including createdAt and updatedAt
      for (const { category, subCategories } of testData) {
        const categoryResponse = body.expenseCategories.find((cat: any) => cat.id === category.id)

        // Check the category data
        expect(categoryResponse).toEqual(
          expect.objectContaining({
            id: category.id,
            name: category.name,
            userId: category.userId,
            accountId: category.accountId,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
          }),
        )

        // Check all subcategories for this category
        expect(categoryResponse.subCategories.length).toBe(subCategories.length)

        for (const subCategory of subCategories) {
          expect(categoryResponse.subCategories).toContainEqual(
            expect.objectContaining({
              id: subCategory.id,
              name: subCategory.name,
              userId: subCategory.userId,
              accountId: subCategory.accountId,
              categoryId: category.id,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          )
        }
      }
    })
  })

  test.describe('when account has no expenseCategories', () => {
    test('should return an empty array', async ({ request }) => {
      const fakeAccountId = crypto.randomUUID()
      const fakeUserId = crypto.randomUUID()

      const response = await request.get(`${BASE_URL}/getexpensecategories`, {
        params: {
          userId: fakeUserId,
          accountId: fakeAccountId,
        },
      })

      expect(response.status()).toBe(STATUS_SUCCESS_200)
      const body = await response.json()
      expect(body.expenseCategories.length).toBe(0)
    })
  })
})

interface CategoryWithSubCategories {
  category: {
    id: string
    userId: string
    accountId: string
    name: string
    createdAt: Date
    updatedAt: Date
  }
  subCategories: Array<{
    id: string
    userId: string
    accountId: string
    name: string
    categoryId: string
    createdAt: Date
    updatedAt: Date
  }>
}

async function createTestData(
  userId: string,
  accountId: string,
): Promise<CategoryWithSubCategories[]> {
  const result: CategoryWithSubCategories[] = []

  // Create first category
  const [category1] = await db
    .insert(expenseCategoriesTable)
    .values({
      userId,
      accountId,
      name: `Groceries-${Math.random()}`,
    })
    .returning()

  // Create second category
  const [category2] = await db
    .insert(expenseCategoriesTable)
    .values({
      userId,
      accountId,
      name: `Utilities-${Math.random()}`,
    })
    .returning()

  // Create subcategories for first category
  const [subCategory1] = await db
    .insert(expenseSubCategoriesTable)
    .values({
      userId,
      accountId,
      name: `Produce-${Math.random()}`,
      categoryId: category1.id,
    })
    .returning()

  const [subCategory2] = await db
    .insert(expenseSubCategoriesTable)
    .values({
      userId,
      accountId,
      name: `Dairy-${Math.random()}`,
      categoryId: category1.id,
    })
    .returning()

  // Create subcategory for second category
  const [subCategory3] = await db
    .insert(expenseSubCategoriesTable)
    .values({
      userId,
      accountId,
      name: `Electricity-${Math.random()}`,
      categoryId: category2.id,
    })
    .returning()

  result.push({
    category: category1,
    subCategories: [subCategory1, subCategory2],
  })

  result.push({
    category: category2,
    subCategories: [subCategory3],
  })

  return result
}
