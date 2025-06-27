import { db } from '../db'
import { EXPENSE_CATEGORIES_OBJ_STORE, READ, WRITE } from './types'

interface ExpenseCategoriesObjectStoreV1 {
  name: string
  subcategories: string[]
}

export interface ExpenseCategoriesObjectStore extends ExpenseCategoriesObjectStoreV1 {}

export function readExpenseCategoriesTransaction(): IDBObjectStore {
  return db
    .transaction(EXPENSE_CATEGORIES_OBJ_STORE, READ)
    .objectStore(EXPENSE_CATEGORIES_OBJ_STORE)
}

export function writeExpenseCategoriesTransaction(): IDBObjectStore {
  return db
    .transaction(EXPENSE_CATEGORIES_OBJ_STORE, WRITE)
    .objectStore(EXPENSE_CATEGORIES_OBJ_STORE)
}
