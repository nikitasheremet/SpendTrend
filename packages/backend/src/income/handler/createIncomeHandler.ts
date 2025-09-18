import type { Context } from 'koa'
import { createIncomeService } from '../service/createIncomeService'
import { validateCreateIncomeInput } from '../validation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createIncomeHandler(ctx: Context) {
  try {
    const input = ctx.request.body
    validateCreateIncomeInput(input)
    const income = await createIncomeService(input)
    ctx.status = STATUS_CREATED_201
    ctx.body = { createdIncome: income }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}