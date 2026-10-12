import { createLinearIssue } from '../../lib/linearClient'
import type { SessionUser } from '../../models/sessionUser'
import { ReportingNotConfiguredError } from '../../models/errors/reportingNotConfiguredError'
import { OTHER_BANK, type CreateFailedPasteReportInput } from '../validation/models'

const REPORT_LABEL_NAMES = ['failed-paste-report', 'Bug']
const TITLE_PREFIX = 'Failed Add Data Paste Report'
const TITLE_MESSAGE_MAX_LENGTH = 60
const PREFIXED_ENVIRONMENTS = ['dev', 'local']
const PRODUCTION_ENVIRONMENT = 'production'

export async function createFailedPasteReportService(
  report: CreateFailedPasteReportInput,
  sessionUser: SessionUser,
): Promise<void> {
  const apiKey = process.env.LINEAR_API_KEY
  if (!apiKey) {
    throw new ReportingNotConfiguredError()
  }

  await createLinearIssue({
    apiKey,
    title: buildTitle(report),
    description: buildDescription(report, sessionUser),
    labelNames: REPORT_LABEL_NAMES,
  })
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
function getReportEnvironment(): string {
  const environment = process.env.APP_ENV ?? process.env.NODE_ENV ?? PRODUCTION_ENVIRONMENT
  return PREFIXED_ENVIRONMENTS.includes(environment) ? environment : PRODUCTION_ENVIRONMENT
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

  const cut = singleLineMessage.slice(0, TITLE_MESSAGE_MAX_LENGTH + 1)
  const lastSpaceIndex = cut.lastIndexOf(' ')
  const wordBoundaryCut = lastSpaceIndex > 0 ? cut.slice(0, lastSpaceIndex) : cut.slice(0, -1)
  return `${wordBoundaryCut.replace(/[\s,.;:]+$/, '')}…`
}
