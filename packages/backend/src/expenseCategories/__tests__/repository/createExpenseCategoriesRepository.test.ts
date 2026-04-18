import { createExpenseCategoriesRepository } from '../../repository/createExpenseCategoriesRepository'
import { db } from '../../../db'
import { DB_ERROR, RepositoryError } from '../../../models/errors/repositoryErrors'

vi.mock('../../../db')

describe('when createExpenseCategoriesRepository is called', () => {
  const mockInsert = db.insert as Mock
  const fakeInput = {
    userId: 'u1',
    accountId: 'a1',
    name: ['n1', 'n2'],
  }

  beforeEach(() => {
    mockInsert.mockReset()
  })

  describe('when expenseCategories are created successfully', () => {
    it('should return created expenseCategories with empty subcategories array', async () => {
      const fakeReturnedDbRows = [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          userId: fakeInput.userId,
          accountId: fakeInput.accountId,
          name: fakeInput.name[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          userId: fakeInput.userId,
          accountId: fakeInput.accountId,
          name: fakeInput.name[1],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      mockInsert.mockReturnValueOnce({ values: () => ({ returning: () => fakeReturnedDbRows }) })

      const result = await createExpenseCategoriesRepository(fakeInput)

      expect(mockInsert).toHaveBeenCalledTimes(1)
      expect(result).toEqual([
        {
          id: fakeReturnedDbRows[0].id,
          userId: fakeReturnedDbRows[0].userId,
          accountId: fakeReturnedDbRows[0].accountId,
          name: fakeReturnedDbRows[0].name,
          subCategories: [],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: fakeReturnedDbRows[1].id,
          userId: fakeReturnedDbRows[1].userId,
          accountId: fakeReturnedDbRows[1].accountId,
          name: fakeReturnedDbRows[1].name,
          subCategories: [],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ])
    })

    it('should create and return a single expenseCategory when name has one value', async () => {
      const fakeSingleInput = { userId: 'u3', accountId: 'a3', name: ['n3'] }
      const fakeReturnedDbRows = [
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          userId: fakeSingleInput.userId,
          accountId: fakeSingleInput.accountId,
          name: fakeSingleInput.name[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      mockInsert.mockReturnValueOnce({ values: () => ({ returning: () => fakeReturnedDbRows }) })

      const result = await createExpenseCategoriesRepository(fakeSingleInput)

      expect(mockInsert).toHaveBeenCalledTimes(1)
      expect(result).toEqual([
        {
          id: fakeReturnedDbRows[0].id,
          userId: fakeReturnedDbRows[0].userId,
          accountId: fakeReturnedDbRows[0].accountId,
          name: fakeReturnedDbRows[0].name,
          subCategories: [],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ])
    })
  })

  describe('when input is empty', () => {
    it('should return an empty array and skip db insert when names are empty', async () => {
      const result = await createExpenseCategoriesRepository({
        userId: 'u1',
        accountId: 'a1',
        name: [],
      })

      expect(result).toEqual([])
      expect(mockInsert).not.toHaveBeenCalled()
    })
  })

  describe('when db operations fail', () => {
    it('should return failure message with DB_ERROR when insert fails', async () => {
      mockInsert.mockImplementationOnce(() => {
        throw new Error('insert failed')
      })

      const result = createExpenseCategoriesRepository(fakeInput)
      await expect(result).rejects.toThrow(RepositoryError)
      await expect(result).rejects.toThrow(DB_ERROR)
    })
  })
})
