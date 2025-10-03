import type { Context } from 'hono'
import { validateCreateExpenseSubCategoryInput } from '../validation'
import { createExpenseSubCategoryService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../../models/statusCodes'
import { CreateExpenseSubCategoryInput } from '../validation/models'

export async function createExpenseSubCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateCreateExpenseSubCategoryInput(input)
    const expenseSubCategory = await createExpenseSubCategoryService(input)
    return ctx.json({ expenseSubCategory }, STATUS_CREATED_201)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
