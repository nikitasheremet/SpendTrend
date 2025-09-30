import type { Context } from 'koa'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { validateDeleteIncomeInput } from '../validation'
import { deleteIncomeService } from '../service/deleteIncomeService'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteIncomeHandler(ctx: Context) {
  try {
    const input = ctx.request.body
    validateDeleteIncomeInput(input)

    const deletedIncome = await deleteIncomeService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = {
      income: deletedIncome,
    }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
