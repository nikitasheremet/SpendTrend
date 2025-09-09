const mockDb = {
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn(),
      }),
    }),
  }),
  query: {
    expensesTable: {
      findMany: jest.fn(),
    },
    expenseCategoriesTable: {
      findFirst: jest.fn(),
    },
  },
  delete: jest.fn()
}

export const db = mockDb
