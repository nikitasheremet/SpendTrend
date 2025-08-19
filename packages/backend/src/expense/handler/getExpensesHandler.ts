import type { Context } from 'koa'
import { validateGetExpensesInput } from '../validation/getExpensesValidation'
import { getExpensesService } from '../service/getExpensesService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function getExpensesHandler(ctx: Context) {
  try {
    validateGetExpensesInput(ctx.request.query)
    const expenses = await getExpensesService(ctx.request.query)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { expenses }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
