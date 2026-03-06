import { vi } from 'vitest'

const mockDb = {
  insert: vi.fn(),
  select: vi.fn(),
  update: vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn(),
      }),
    }),
  }),
  query: {
    expensesTable: {
      findMany: vi.fn(),
    },
    expenseCategoriesTable: {
      findFirst: vi.fn(),
    },
  },
  delete: vi.fn(),
}

export const db = mockDb
