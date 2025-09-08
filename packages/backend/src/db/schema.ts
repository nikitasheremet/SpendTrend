import { relations } from 'drizzle-orm'
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

export const expenseSubcategories = pgTable(
  'expense_subcategories',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull(),
    accountId: uuid().notNull(),
    name: varchar({ length: 255 }).notNull(),
    categoryId: uuid()
      .notNull()
      .references(() => expenseCategoriesTable.id),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('categoryId_name').on(table.categoryId, table.name)],
)

export const expenseSubcategoriesRelations = relations(expenseSubcategories, ({ one }) => ({
  category: one(expenseCategoriesTable, {
    fields: [expenseSubcategories.categoryId],
    references: [expenseCategoriesTable.id],
  }),
}))

export const expenseCategoriesTable = pgTable(
  'expense_categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull(),
    accountId: uuid().notNull(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('accountId_name').on(table.accountId, table.name)],
)

export const expenseCategoriesRelations = relations(expenseCategoriesTable, ({ many }) => ({
  expenses: many(expensesTable),
  subcategories: many(expenseSubcategories),
}))

export const expensesTable = pgTable('expenses', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull(),
  accountId: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: integer().notNull(),
  date: date().notNull(),
  paidBackAmount: integer().notNull(),
  categoryId: uuid()
    .notNull()
    .references(() => expenseCategoriesTable.id),
  subCategoryId: uuid()
    .notNull()
    .references(() => expenseSubcategories.id),
  netAmount: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  category: one(expenseCategoriesTable, {
    fields: [expensesTable.categoryId],
    references: [expenseCategoriesTable.id],
  }),
  subcategory: one(expenseSubcategories, {
    fields: [expensesTable.subCategoryId],
    references: [expenseSubcategories.id],
  }),
}))

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
