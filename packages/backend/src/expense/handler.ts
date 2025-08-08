import type { Context } from 'koa'
import { createExpenseService } from './service'
import { validateExpenseInput } from './validation'
import { errorStatusMapper } from '../utilities/errorStatusMapper'
import { STATUS_CREATED_201 } from '../models/statusCodes'

export async function createExpenseHandler(ctx: Context) {
  try {
    const input = ctx.request.body
    validateExpenseInput(input)
    const expense = await createExpenseService(input)
    ctx.status = STATUS_CREATED_201
    ctx.body = expense
  } catch (error) {
    ctx.status = errorStatusMapper(error)
    ctx.body = { error: (error as Error).message }
  }
}
