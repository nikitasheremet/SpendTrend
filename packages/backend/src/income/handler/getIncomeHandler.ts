import type { Context } from 'koa'
import { getIncomeService } from '../service/getIncomeService'
import { validateGetIncomeInput } from '../validation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function getIncomeHandler(ctx: Context) {
  try {
    const input = ctx.request.body
    validateGetIncomeInput(input)
    const income = await getIncomeService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { income }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}