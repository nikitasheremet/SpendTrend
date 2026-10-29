import type { Context } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { createFactory } from 'hono/factory'
import '../../models/sessionUser'
import { createFailedPasteReportService } from '../service/createFailedPasteReportService'
import { validateCreateFailedPasteReportInput } from '../validation/createFailedPasteReportValidation'
import { reserveFailedPasteReportSlot } from '../rateLimit/failedPasteReportRateLimit'
import { TooManyFailedPasteReportsError } from '../../models/errors/tooManyFailedPasteReportsError'
import { errorStatusMapper } from '../../utilities/errorStatusMapper'
import { jsonResponse } from '../../utilities/jsonResponse'
import { STATUS_CREATED_201, STATUS_PAYLOAD_TOO_LARGE_413 } from '../../models/statusCodes'

// The scrambled HTML and text are each capped at 2 MB, so this leaves room for the rest of the report.
const MAX_BODY_BYTES = 5 * 1024 * 1024
const BODY_TOO_LARGE_ERROR = 'The report is too large to send'
// Hono doesn't export the error bodyLimit raises when a body with no Content-Length runs over.
const BODY_LIMIT_ERROR_NAME = 'BodyLimitError'

export const createFailedPasteReportHandlers = createFactory().createHandlers(
  bodyLimit({
    maxSize: MAX_BODY_BYTES,
    onError: (ctx) =>
      jsonResponse(ctx, { error: BODY_TOO_LARGE_ERROR }, STATUS_PAYLOAD_TOO_LARGE_413),
  }),
  createFailedPasteReportHandler,
)

async function createFailedPasteReportHandler(ctx: Context): Promise<Response> {
  let releaseSlot = () => {}
  try {
    const input = await ctx.req.json()
    const report = validateCreateFailedPasteReportInput(input)
    const sessionUser = ctx.get('sessionUser')
    releaseSlot = reserveFailedPasteReportSlot(sessionUser.id)
    await createFailedPasteReportService(report, sessionUser)
    return jsonResponse(ctx, {}, STATUS_CREATED_201)
  } catch (error) {
    releaseSlot()
    // bodyLimit only answers 413 if its error reaches it.
    if ((error as Error).name === BODY_LIMIT_ERROR_NAME) {
      throw error
    }
    if (error instanceof TooManyFailedPasteReportsError) {
      ctx.header('Retry-After', String(error.retryAfterSeconds))
    }
    return jsonResponse(ctx, { error: (error as Error).message }, errorStatusMapper(error))
  }
}
