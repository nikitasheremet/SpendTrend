import type { Context } from 'koa'
import { getIncomeService } from '../service/getIncomeService'
import { validateGetIncomesInput } from '../validation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function getIncomesHandler(ctx: Context) {
  try {
    const input = ctx.request.body
    validateGetIncomesInput(input)
    const incomes = await getIncomeService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { incomes }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}