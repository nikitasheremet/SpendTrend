import type { Context } from 'koa'
import { validateUpdateExpenseInput } from '../validation/updateExpenseValidation'
import { updateExpenseService } from '../service/updateExpenseService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateExpenseHandler(ctx: Context) {
  try {
    validateUpdateExpenseInput(ctx.request.body)
    const updatedExpense = await updateExpenseService(ctx.request.body)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { updatedExpense }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
