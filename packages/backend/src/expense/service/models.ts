import { Expense } from '../../models/expense/Expense'
import { OmitAndMakeOptionalExceptForSome } from '../../utilities/typeUtilities/omitAndMakeOptionExceptForSome'

type NonUpdatableFields = 'createdAt' | 'updatedAt' | 'accountId' | 'userId'

export type UpdateExpenseInput = OmitAndMakeOptionalExceptForSome<Expense, 'id', NonUpdatableFields>
