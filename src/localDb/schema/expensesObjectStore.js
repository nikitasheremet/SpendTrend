import { db } from '../db';
import { EXPENSES_OBJ_STORE, READ, WRITE } from './types';
export function readExpenseTransaction() {
    return db.transaction(EXPENSES_OBJ_STORE, READ).objectStore(EXPENSES_OBJ_STORE);
}
export function writeExpenseTransaction() {
    return db.transaction(EXPENSES_OBJ_STORE, WRITE).objectStore(EXPENSES_OBJ_STORE);
}
