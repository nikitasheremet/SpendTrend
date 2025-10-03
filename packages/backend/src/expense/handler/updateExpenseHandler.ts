import type { Context } from 'hono'
import { validateUpdateExpenseInput } from '../validation/updateExpenseValidation'
import { updateExpenseService } from '../service/updateExpenseService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateExpenseHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateUpdateExpenseInput(input)
    const updatedExpense = await updateExpenseService(input)
    return ctx.json({ updatedExpense }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
