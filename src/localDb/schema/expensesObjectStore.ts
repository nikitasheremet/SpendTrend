import { db } from '../db'
import { EXPENSES_OBJ_STORE, READ, WRITE } from './types'

export interface ExpensesObjectStoreSchemaV1 {
  id: string
  name: string
  date: number
  netAmount: number
  amount: number
  paidBackAmount: number
  category: string
  subCategory: string
}

export function readTransaction(): IDBObjectStore {
  return db.transaction(EXPENSES_OBJ_STORE, READ).objectStore(EXPENSES_OBJ_STORE)
}

export function writeTransaction(): IDBObjectStore {
  return db.transaction(EXPENSES_OBJ_STORE, WRITE).objectStore(EXPENSES_OBJ_STORE)
}
