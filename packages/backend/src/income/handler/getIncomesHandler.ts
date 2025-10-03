import type { Context } from 'hono'
import { getIncomesService } from '../service/getIncomesService'
import { validateGetIncomesInput } from '../validation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function getIncomesHandler(ctx: Context): Promise<Response> {
  try {
    const input = ctx.req.query()
    validateGetIncomesInput(input)
    const incomes = await getIncomesService(input)
    return ctx.json({ incomes }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
