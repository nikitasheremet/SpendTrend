import type { Context } from 'hono'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { validateDeleteIncomeInput } from '../validation'
import { deleteIncomeService } from '../service/deleteIncomeService'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteIncomeHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateDeleteIncomeInput(input)

    const deletedIncome = await deleteIncomeService(input)
    return jsonResponse(ctx, { deletedIncome }, STATUS_SUCCESS_200)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
