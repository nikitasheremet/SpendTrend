import type { Context } from 'hono'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { validateDeleteExpenseInput } from '../validation'
import { deleteExpenseService } from '../service/deleteExpenseService'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteExpenseHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateDeleteExpenseInput(input)

    const deletedExpense = await deleteExpenseService(input)
    return jsonResponse(ctx, { expense: deletedExpense }, STATUS_SUCCESS_200)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
