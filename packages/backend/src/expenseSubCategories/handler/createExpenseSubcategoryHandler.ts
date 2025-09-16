import type { Context } from 'koa'
import { validateCreateExpenseSubcategoryInput } from '../validation'
import { createExpenseSubcategoryService } from '../service'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../../models/statusCodes'
import { CreateExpenseSubcategoryInput } from '../validation/models'

export async function createExpenseSubCategoryHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.request.body
    validateCreateExpenseSubcategoryInput(input)
    const expenseSubCategory = await createExpenseSubcategoryService(
      input as CreateExpenseSubcategoryInput,
    )
    ctx.status = STATUS_CREATED_201
    ctx.body = { expenseSubCategory }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
