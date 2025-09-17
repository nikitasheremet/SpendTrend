import type { Context } from 'koa'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { validateDeleteExpenseInput } from '../validation'
import { deleteExpenseService } from '../service/deleteExpenseService'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteExpenseHandler(ctx: Context) {
  try {
    const input = ctx.request.body
    validateDeleteExpenseInput(input)

    const deletedExpense = await deleteExpenseService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = {
      expense: deletedExpense,
    }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
