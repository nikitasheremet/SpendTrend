export interface ExpensesObjectStoreSchemaV1 {
    id: string;
    name: string;
    date: number;
    netAmount: number;
    amount: number;
    paidBackAmount: number;
    category: string;
    subCategory: string;
}
export declare function readExpenseTransaction(): IDBObjectStore;
export declare function writeExpenseTransaction(): IDBObjectStore;
