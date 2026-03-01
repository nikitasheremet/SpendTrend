import type { Context } from 'hono'
import { validateUpdateIncomeInput } from '../validation/updateIncomeValidation'
import { updateIncomeService } from '../service/updateIncomeService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateIncomeHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateUpdateIncomeInput(input)
    const updatedIncome = await updateIncomeService(input)
    return jsonResponse(ctx, { updatedIncome }, STATUS_SUCCESS_200)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
