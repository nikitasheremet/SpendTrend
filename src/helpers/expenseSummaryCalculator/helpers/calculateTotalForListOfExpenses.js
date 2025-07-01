import { totalReducer } from './totalReducer';
export function calculateTotalForListOfExpenses(listOfExpenses) {
    return totalReducer('netAmount', listOfExpenses);
}
