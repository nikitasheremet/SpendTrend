import type { Context } from 'koa'
import { validateDeleteExpenseCategoryInput } from '../validation/deleteExpenseCategoryValidation'
import { deleteExpenseCategoryService } from '../service/deleteExpenseCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteExpenseCategoryHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.request.body
    validateDeleteExpenseCategoryInput(input)
    const result = await deleteExpenseCategoryService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { expenseCategory: result }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
