import type { Context } from 'hono'
import { createExpenseService } from '../service/createExpenseService'
import { validateCreateExpenseInput } from '../validation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createExpenseHandler(ctx: Context): Promise<Response> {
  try {
    const input = ctx.req.parseBody()
    validateCreateExpenseInput(input)
    const createdExpense = await createExpenseService(input)
    return ctx.json({ createdExpense }, STATUS_CREATED_201)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
