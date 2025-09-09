import type { Context } from 'koa'
import { validateUpdateExpenseCategoryInput } from '../validation/updateExpenseCategoryValidation'
import { updateExpenseCategoryService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateExpenseCategoryHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.request.body
    validateUpdateExpenseCategoryInput(input)
    const result = await updateExpenseCategoryService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { expenseCategory: result }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
