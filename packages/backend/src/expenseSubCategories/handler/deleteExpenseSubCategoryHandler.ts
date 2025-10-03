import type { Context } from 'hono'
import { validateDeleteExpenseSubCategory } from '../validation'
import { deleteExpenseSubCategoryService } from '../service/deleteExpenseSubCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'
import { DeleteExpenseSubCategoryInput } from '../validation/models'

export async function deleteExpenseSubCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateDeleteExpenseSubCategory(input)
    const deletedExpenseSubCategory = await deleteExpenseSubCategoryService(input)
    return ctx.json({ deletedExpenseSubCategory }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
