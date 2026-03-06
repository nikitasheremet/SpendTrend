import type { Context } from 'hono'
import { validateCreateExpenseSubCategoryInput } from '../validation'
import { createExpenseSubCategoryService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createExpenseSubCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateCreateExpenseSubCategoryInput(input)
    const expenseSubCategory = await createExpenseSubCategoryService(input)
    return jsonResponse(ctx, { expenseSubCategory }, STATUS_CREATED_201)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
