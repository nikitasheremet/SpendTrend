import type { Context } from 'hono'
import '../../models/sessionUser'
import { createFailedPasteReportService } from '../service/createFailedPasteReportService'
import { validateCreateFailedPasteReportInput } from '../validation/createFailedPasteReportValidation'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_CREATED_201 } from '../../models/statusCodes'

export async function createFailedPasteReportHandler(ctx: Context): Promise<Response> {
  try {
    const input = await ctx.req.json()
    const report = validateCreateFailedPasteReportInput(input)
    await createFailedPasteReportService(report, ctx.get('sessionUser'))
    return jsonResponse(ctx, {}, STATUS_CREATED_201)
  } catch (error) {
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
