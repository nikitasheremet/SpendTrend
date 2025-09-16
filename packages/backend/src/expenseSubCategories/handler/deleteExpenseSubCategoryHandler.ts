import type { Context } from 'koa'
import { validateDeleteExpenseSubCategory } from '../validation'
import { deleteExpenseSubCategoryService } from '../service/deleteExpenseSubCategoryService'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'
import { DeleteExpenseSubCategoryInput } from '../validation/models'

export async function deleteExpenseSubCategoryHandler(ctx: Context): Promise<void> {
  try {
    const input = ctx.request.body
    validateDeleteExpenseSubCategory(input)
    const deleteExpenseSubCategory = await deleteExpenseSubCategoryService(
      input as DeleteExpenseSubCategoryInput,
    )
    ctx.status = STATUS_SUCCESS_200
    ctx.body = { deleteExpenseSubCategory }
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
