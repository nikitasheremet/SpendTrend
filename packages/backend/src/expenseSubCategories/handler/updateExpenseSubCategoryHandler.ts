import type { Context } from 'koa'
import { validateUpdateExpenseSubCategory } from '../validation/updateExpenseSubCategoryValidation'
import { updateExpenseSubCategoryService } from '../service/updateExpenseSubCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function updateExpenseSubcategoryHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.request.body
    validateUpdateExpenseSubCategory(input)
    const updatedExpenseSubCategory = await updateExpenseSubCategoryService(input)
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { updatedExpenseSubCategory }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
