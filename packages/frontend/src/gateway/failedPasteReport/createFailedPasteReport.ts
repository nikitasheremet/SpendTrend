import type {
  CreateFailedPasteReportRequest,
  CreateFailedPasteReportResponse,
} from '@contracts/failedPasteReport/createFailedPasteReport'
import { post } from '@gateway/post'

export async function createFailedPasteReport(
  report: CreateFailedPasteReportRequest,
): Promise<void> {
  await post<CreateFailedPasteReportResponse>('createfailedpastereport', report)
}
