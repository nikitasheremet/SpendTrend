import { uuid } from 'drizzle-orm/pg-core'
import {
  integer,
  pgTable,
  varchar,
  uniqueIndex,
  date,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core'

export const expenseCategoriesTable = pgTable(
  'expense_categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull(),
    accountId: uuid().notNull(),
    name: varchar({ length: 255 }).notNull(),
    subcategories: varchar({ length: 255 }).array().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('accountId_name').on(table.accountId, table.name)],
)

export const expensesTable = pgTable('expenses', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull(),
  accountId: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: integer().notNull(),
  date: date().notNull(),
  paidBackAmount: integer().notNull(),
  category: uuid()
    .notNull()
    .references(() => expenseCategoriesTable.id),
  subCategory: varchar({ length: 255 }).notNull(),
  netAmount: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export type ExpensesTableRow = typeof expensesTable.$inferSelect

export const incomeTable = pgTable('income', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull(),
  accountId: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: decimal().notNull(),
  date: date().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
