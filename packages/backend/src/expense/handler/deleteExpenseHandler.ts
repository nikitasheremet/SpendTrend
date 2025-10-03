import type { Context } from 'hono'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { validateDeleteExpenseInput } from '../validation'
import { deleteExpenseService } from '../service/deleteExpenseService'
import { STATUS_SUCCESS_200 } from '../../models/statusCodes'

export async function deleteExpenseHandler(ctx: Context): Promise<Response> {
  try {
    const input = ctx.req.formData()
    validateDeleteExpenseInput(input)

    const deletedExpense = await deleteExpenseService(input)
    return ctx.json({ expense: deletedExpense }, STATUS_SUCCESS_200)
  } catch (error) {
    return ctx.json({ error: (error as Error).message }, errorStatusMapper(error))
  }
}
