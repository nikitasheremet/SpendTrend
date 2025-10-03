import type { Context } from 'hono'
import { validateUpdateIncomeInput } from '../validation/updateIncomeValidation'
import { updateIncomeService } from '../service/updateIncomeService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateIncomeHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateUpdateIncomeInput(input)
    const updatedIncome = await updateIncomeService(input)
    return ctx.json({ updatedIncome }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
