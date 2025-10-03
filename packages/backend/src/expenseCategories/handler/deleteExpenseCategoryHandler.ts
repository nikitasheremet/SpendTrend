import type { Context } from 'hono'
import { validateDeleteExpenseCategoryInput } from '../validation/deleteExpenseCategoryValidation'
import { deleteExpenseCategoryService } from '../service/deleteExpenseCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteExpenseCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateDeleteExpenseCategoryInput(input)
    const result = await deleteExpenseCategoryService(input)
    return ctx.json({ expenseCategory: result }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
