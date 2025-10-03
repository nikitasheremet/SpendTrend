import type { Context } from 'hono'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { validateDeleteIncomeInput } from '../validation'
import { deleteIncomeService } from '../service/deleteIncomeService'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteIncomeHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    validateDeleteIncomeInput(input)

    const deletedIncome = await deleteIncomeService(input)
    return ctx.json({ deletedIncome }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
