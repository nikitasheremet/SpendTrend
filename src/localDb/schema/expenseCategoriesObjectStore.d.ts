interface ExpenseCategoriesObjectStoreV1 {
    name: string;
    subcategories: string[];
}
export interface ExpenseCategoriesObjectStore extends ExpenseCategoriesObjectStoreV1 {
}
export declare function readExpenseCategoriesTransaction(): IDBObjectStore;
export declare function writeExpenseCategoriesTransaction(): IDBObjectStore;
export {};
