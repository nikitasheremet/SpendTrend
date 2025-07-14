import { integer, pgTable, varchar, index } from 'drizzle-orm/pg-core'
export const expensesTable = pgTable('expenses', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: integer().notNull(),
  date: varchar({ length: 255 }).notNull(),
  paidBackAmount: integer().notNull(),
  category: varchar({ length: 255 }).notNull(),
  subCategory: varchar({ length: 255 }).notNull(),
  netAmount: integer().notNull(),
})

export const expenseCategoriesTable = pgTable(
  'expense_categories',
  {
    userId: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    subcategories: varchar({ length: 255 }).array().notNull(),
  },
  (table) => [index('userId_name').on(table.userId, table.name)],
)
