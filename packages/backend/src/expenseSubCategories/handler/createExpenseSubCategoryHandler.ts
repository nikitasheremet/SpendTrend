import type { Context } from 'koa'
import { validateCreateExpenseSubCategoryInput } from '../validation'
import { createExpenseSubCategoryService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../../models/statusCodes'
import { CreateExpenseSubCategoryInput } from '../validation/models'

export async function createExpenseSubCategoryHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.request.body
    validateCreateExpenseSubCategoryInput(input)
    const expenseSubCategory = await createExpenseSubCategoryService(
      input as CreateExpenseSubCategoryInput,
    )
    ctx.status = STATUS_CREATED_201
    ctx.body = { expenseSubCategory }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
