import type { Context } from 'hono'
import { validateDeleteExpenseSubCategory } from '../validation'
import { deleteExpenseSubCategoryService } from '../service/deleteExpenseSubCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteExpenseSubCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateDeleteExpenseSubCategory(input)
    const deletedExpenseSubCategory = await deleteExpenseSubCategoryService(input)
    return jsonResponse(ctx, { deletedExpenseSubCategory }, STATUS_SUCCESS_200)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
