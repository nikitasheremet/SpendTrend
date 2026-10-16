import { createLinearIssue, type CreateLinearIssueInput } from '../../lib/linearClient'
import type { SessionUser } from '../../models/sessionUser'
import { ReportingNotConfiguredError } from '../../models/errors/reportingNotConfiguredError'
import { OTHER_BANK, type CreateFailedPasteReportInput } from '../validation/models'

const REPORT_LABEL_NAMES = ['failed-paste-report', 'Bug']
// Setting LINEAR_API_KEY to this logs the issue instead of filing it, for trying reports locally.
const DEBUG_ONLY_PRINT_API_KEY = 'debug_only_print'
const TITLE_PREFIX = 'Failed Add Data Paste Report'
const TITLE_MESSAGE_MAX_LENGTH = 60
const PREFIXED_ENVIRONMENTS: ReportEnvironment[] = ['dev', 'local']
const PRODUCTION_ENVIRONMENT: ReportEnvironment = 'production'

type ReportEnvironment = 'local' | 'dev' | 'production'

export async function createFailedPasteReportService(
  report: CreateFailedPasteReportInput,
  sessionUser: SessionUser,
): Promise<void> {
  const apiKey = process.env.LINEAR_API_KEY
  if (!apiKey) {
    throw new ReportingNotConfiguredError()
  }

  const issue = {
    title: buildTitle(report),
    description: buildDescription(report, sessionUser),
    labelNames: REPORT_LABEL_NAMES,
  }
  if (apiKey === DEBUG_ONLY_PRINT_API_KEY) {
    printIssue(issue)
    return
  }

  await createLinearIssue({ apiKey, ...issue })
}

function printIssue({
  title,
  description,
  labelNames,
}: Omit<CreateLinearIssueInput, 'apiKey'>): void {
  console.log(
    [
      'Failed Add Data Paste Report not sent to Linear (debug_only_print):',
      `Title: ${title}`,
      `Labels: ${labelNames.join(', ')}`,
      description,
    ].join('\n\n'),
  )
}

function buildTitle(report: CreateFailedPasteReportInput): string {
  const environment = getReportEnvironment()
  const environmentPrefix = environment === PRODUCTION_ENVIRONMENT ? '' : `[${environment}] `
  return `${environmentPrefix}${TITLE_PREFIX}: ${describeBank(report)} – ${excerptMessage(report.message)}`
}

function buildDescription(report: CreateFailedPasteReportInput, sessionUser: SessionUser): string {
  const quotedMessage = report.message
    .trim()
    .split('\n')
    .map((line) => `> ${line}`)
  const details: Array<[string, string | number]> = [
    ['Bank', describeBank(report)],
    ['App Version', report.appVersion],
    ['Environment', getReportEnvironment()],
    ['User ID', sessionUser.id],
    ['Account ID', sessionUser.accountId],
    ['User agent', report.userAgent],
    ['Pasted at', report.pastedAt],
    ['Reported at', new Date().toISOString()],
    ['Clipboard formats', report.clipboardTypes.join(', ')],
    ['Expenses added', report.expenseCount],
    ['Incomes added', report.incomeCount],
  ]

  return [
    '## What went wrong',
    '',
    ...quotedMessage,
    '',
    '## Report details',
    '',
    ...details.map(([label, value]) => `- **${label}:** ${value}`),
  ].join('\n')
}

// Env vars are baked in at build time, so APP_ENV names the deployed environment;
// NODE_ENV covers local runs. Anything unrecognised is treated as production.
function getReportEnvironment(): ReportEnvironment {
  const environment = process.env.APP_ENV ?? process.env.NODE_ENV
  return (
    PREFIXED_ENVIRONMENTS.find((prefixed) => prefixed === environment) ?? PRODUCTION_ENVIRONMENT
  )
}

function describeBank(report: CreateFailedPasteReportInput): string {
  if (report.bank === OTHER_BANK) {
    return `${OTHER_BANK}: ${report.otherBankName?.trim()}`
  }
  return report.bank
}

// Collapses whitespace and cuts at the last word that fits, so titles stay scannable.
function excerptMessage(message: string): string {
  const singleLineMessage = message.trim().replace(/\s+/g, ' ')
  if (singleLineMessage.length <= TITLE_MESSAGE_MAX_LENGTH) {
    return singleLineMessage
  }

  // One extra character shows whether the last word runs past the limit.
  const excerptCandidate = singleLineMessage.slice(0, TITLE_MESSAGE_MAX_LENGTH + 1)
  const lastSpaceIndex = excerptCandidate.lastIndexOf(' ')
  const wordBoundaryCut =
    lastSpaceIndex > 0 ? excerptCandidate.slice(0, lastSpaceIndex) : excerptCandidate.slice(0, -1)
  return `${wordBoundaryCut.replace(/[\s,.;:]+$/, '')}…`
}
