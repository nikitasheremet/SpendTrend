import type { Context } from 'hono'
import { validateGetExpensesInput } from '../validation/getExpensesValidation'
import { getExpensesService } from '../service/getExpensesService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function getExpensesHandler(ctx: Context): Promise<Response> {
  try {
    const query = ctx.req.query()
    validateGetExpensesInput(query)
    const expenses = await getExpensesService(query)
    return jsonResponse(ctx, { expenses }, STATUS_SUCCESS_200)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
