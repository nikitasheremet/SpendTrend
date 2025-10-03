import type { Context } from 'hono'
import { validateGetExpenseCategoriesInput } from '../validation/getExpenseCategoriesValidation'
import { getExpenseCategoriesService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function getExpenseCategoriesHandler(ctx: Context): Promise<Response> {
  try {
    const input = ctx.req.query()
    validateGetExpenseCategoriesInput(input)
    const result = await getExpenseCategoriesService(input)
    return ctx.json({ expenseCategories: result }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
