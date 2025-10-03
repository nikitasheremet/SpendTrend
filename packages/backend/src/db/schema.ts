import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  varchar,
  uniqueIndex,
  date,
  timestamp,
  text,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core'

export const expenseSubCategoriesTable = pgTable(
  'expense_subcategories',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().notNull(),
    accountId: uuid().notNull(),
    name: varchar({ length: 255 }).notNull(),
    categoryId: uuid()
      .notNull()
      .references(() => expenseCategoriesTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('categoryId_name').on(table.categoryId, table.name)],
)

export const expenseSubCategoriesRelations = relations(expenseSubCategoriesTable, ({ one }) => ({
  category: one(expenseCategoriesTable, {
    fields: [expenseSubCategoriesTable.categoryId],
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
  subCategories: many(expenseSubCategoriesTable),
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
  subCategoryId: uuid().references(() => expenseSubCategoriesTable.id),
  netAmount: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  category: one(expenseCategoriesTable, {
    fields: [expensesTable.categoryId],
    references: [expenseCategoriesTable.id],
  }),
  subCategory: one(expenseSubCategoriesTable, {
    fields: [expensesTable.subCategoryId],
    references: [expenseSubCategoriesTable.id],
  }),
}))

export const incomeTable = pgTable('income', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull(),
  accountId: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: integer().notNull(),
  date: date().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})
