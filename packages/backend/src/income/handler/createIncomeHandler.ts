import type { Context } from 'hono'
import { createIncomeService } from '../service/createIncomeService'
import { validateCreateIncomeInput } from '../validation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createIncomeHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateCreateIncomeInput(input)
    const { createdIncomes, failedIncomes } = await createIncomeService(input)
    return jsonResponse(ctx, { createdIncomes, failedIncomes }, STATUS_CREATED_201)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
