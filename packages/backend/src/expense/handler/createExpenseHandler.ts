import type { Context } from 'hono'
import { createExpenseService } from '../service/createExpenseService'
import { validateCreateExpenseInput } from '../validation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createExpenseHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateCreateExpenseInput(input)
    const createdExpenses = await createExpenseService(input)
    return jsonResponse(ctx, { createdExpenses }, STATUS_CREATED_201)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
