const mockDb = {
  insert: jest.fn(),
  query: {
    expensesTable: {
      findMany: jest.fn(),
    },
  },
}

export const db = mockDb
