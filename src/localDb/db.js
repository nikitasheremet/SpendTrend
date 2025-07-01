import { EXPENSE_CATEGORIES_OBJ_STORE, EXPENSES_OBJ_STORE } from './schema/types';
export let db;
export async function openDB() {
    console.log('Opening database...');
    await new Promise((resolve, reject) => {
        const request = indexedDB.open('spendtrend', 1);
        request.onerror = (event) => {
            console.error("Why didn't you allow my web app to use IndexedDB?!");
            reject(null);
        };
        request.onupgradeneeded = (event) => {
            db = request.result;
            try {
                db.createObjectStore(EXPENSES_OBJ_STORE, { keyPath: 'id' });
                db.createObjectStore(EXPENSE_CATEGORIES_OBJ_STORE, { keyPath: 'name' });
            }
            catch (e) {
                console.error(e);
            }
        };
        request.onsuccess = (event) => {
            if (!db) {
                db = request.result;
            }
            db.onerror = (event) => {
                // Generic error handler for all errors targeted at this database's
                // requests!
                console.error(`Database error:`);
            };
            console.log('Database opened successfully!');
            resolve(null);
        };
    });
}
