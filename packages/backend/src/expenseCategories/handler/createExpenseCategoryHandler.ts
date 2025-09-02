import type { Context } from 'koa'
import { validateCreateExpenseCategoryInput } from '../validation/createExpenseCategoryValidation'
import { createExpenseCategoryService } from '../service/createExpenseCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createExpenseCategoryHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.request.body
    validateCreateExpenseCategoryInput(input)
    const result = await createExpenseCategoryService(input)
    ctx.status = STATUS_CREATED_201
    ctx.body = { expenseCategory: result }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
