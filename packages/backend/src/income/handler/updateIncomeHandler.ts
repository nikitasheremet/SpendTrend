import type { Context } from 'koa'
import { validateUpdateIncomeInput } from '../validation/updateIncomeValidation'
import { updateIncomeService } from '../service/updateIncomeService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateIncomeHandler(ctx: Context) {
  try {
    validateUpdateIncomeInput(ctx.request.body)
    const updatedIncome = await updateIncomeService(ctx.request.body)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { updatedIncome }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
