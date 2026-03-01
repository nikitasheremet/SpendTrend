import type { Context } from 'hono'
import { validateUpdateExpenseInput } from '../validation/updateExpenseValidation'
import { updateExpenseService } from '../service/updateExpenseService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateExpenseHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateUpdateExpenseInput(input)
    const updatedExpense = await updateExpenseService(input)
    return jsonResponse(ctx, { updatedExpense }, STATUS_SUCCESS_200)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
