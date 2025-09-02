import type { Context } from 'koa'
import { validateGetExpenseCategoriesInput } from '../validation/getExpenseCategoriesValidation'
import { getExpenseCategoriesService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function getExpenseCategoriesHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.query
    validateGetExpenseCategoriesInput(input)
    const result = await getExpenseCategoriesService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { expenseCategories: result }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
