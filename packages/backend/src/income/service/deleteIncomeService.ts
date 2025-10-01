import { Income } from '../../models/income/income'
import { deleteIncomeRepository } from '../repository/deleteIncomeRepository'

export interface DeleteIncomeServiceInput {
  id: string
}

export async function deleteIncomeService(input: DeleteIncomeServiceInput): Promise<Income> {
  return await deleteIncomeRepository({ id: input.id })
}
