import type { Context } from 'hono'
import { validateCreateExpenseCategoryInput } from '../validation/createExpenseCategoryValidation'
import { createExpenseCategoryService } from '../service/createExpenseCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createExpenseCategoryHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    console.log('Input:', input)
    validateCreateExpenseCategoryInput(input)
    const result = await createExpenseCategoryService(input)
    return ctx.json({ expenseCategory: result }, STATUS_CREATED_201)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
