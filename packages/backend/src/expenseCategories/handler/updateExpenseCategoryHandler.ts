import type { Context } from 'hono'
import { validateUpdateExpenseCategoryInput } from '../validation/updateExpenseCategoryValidation'
import { updateExpenseCategoryService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateExpenseCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateUpdateExpenseCategoryInput(input)
    const result = await updateExpenseCategoryService(input)
    return ctx.json({ expenseCategory: result }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
