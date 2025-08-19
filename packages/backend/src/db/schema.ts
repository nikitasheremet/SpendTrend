import { uuid } from 'drizzle-orm/pg-core'
import { integer, pgTable, varchar, index, date, timestamp } from 'drizzle-orm/pg-core'
export const expensesTable = pgTable('expenses', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull(),
  accountId: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: integer().notNull(),
  date: date().notNull(),
  paidBackAmount: integer().notNull(),
  category: varchar({ length: 255 }).notNull(),
  subCategory: varchar({ length: 255 }).notNull(),
  netAmount: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export type ExpensesTableRow = typeof expensesTable.$inferSelect

export const expenseCategoriesTable = pgTable(
  'expense_categories',
  {
    userId: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    subcategories: varchar({ length: 255 }).array().notNull(),
  },
  (table) => [index('userId_name').on(table.userId, table.name)],
)
