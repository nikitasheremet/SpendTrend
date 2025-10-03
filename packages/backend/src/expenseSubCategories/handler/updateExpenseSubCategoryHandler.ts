import type { Context } from 'hono'
import { validateUpdateExpenseSubCategory } from '../validation/updateExpenseSubCategoryValidation'
import { updateExpenseSubCategoryService } from '../service/updateExpenseSubCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateExpenseSubCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateUpdateExpenseSubCategory(input)
    const updatedExpenseSubCategory = await updateExpenseSubCategoryService(input)
    return ctx.json({ updatedExpenseSubCategory }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
