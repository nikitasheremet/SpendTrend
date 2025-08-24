const mockDb = {
  insert: jest.fn(),
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
  },
}

export const db = mockDb
