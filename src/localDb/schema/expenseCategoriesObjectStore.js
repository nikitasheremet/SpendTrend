import { db } from '../db';
import { EXPENSE_CATEGORIES_OBJ_STORE, READ, WRITE } from './types';
export function readExpenseCategoriesTransaction() {
    return db
        .transaction(EXPENSE_CATEGORIES_OBJ_STORE, READ)
        .objectStore(EXPENSE_CATEGORIES_OBJ_STORE);
}
export function writeExpenseCategoriesTransaction() {
    return db
        .transaction(EXPENSE_CATEGORIES_OBJ_STORE, WRITE)
        .objectStore(EXPENSE_CATEGORIES_OBJ_STORE);
}
