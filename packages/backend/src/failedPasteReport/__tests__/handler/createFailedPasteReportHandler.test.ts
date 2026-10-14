import { Hono } from 'hono'
import { testClient } from 'hono/testing'
import { createLinearIssue } from '../../../lib/linearClient'
import { createFailedPasteReportHandler } from '../../handler/createFailedPasteReportHandler'
import {
  STATUS_CREATED_201,
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_SERVICE_UNAVAILABLE_503,
  STATUS_INTERNAL_SERVER_ERROR_500,
} from '../../../models/statusCodes'

vi.mock('../../../lib/linearClient')

const mockCreateLinearIssue = vi.mocked(createLinearIssue)

const fakeSessionUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  accountId: '123e4567-e89b-12d3-a456-426614174001',
}

const fakeReport = {
  bank: 'CIBC',
  message: 'The amounts came through as income instead of expenses',
  appVersion: '0.1.45',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Firefox/131.0',
  pastedAt: '2026-10-12T09:30:00.000Z',
  clipboardTypes: ['text/html', 'text/plain'],
  expenseCount: 0,
  incomeCount: 4,
}

function createFakeClient() {
  const fakeApp = new Hono()
    .use(async (ctx, next) => {
      ctx.set('sessionUser', fakeSessionUser)
      await next()
    })
    .post('/createfailedpastereport', createFailedPasteReportHandler)
  return testClient(fakeApp)
}

describe('createFailedPasteReportHandler', () => {
  beforeEach(() => {
    mockCreateLinearIssue.mockReset()
    mockCreateLinearIssue.mockResolvedValue({ identifier: 'SPE-200' })
    vi.stubEnv('LINEAR_API_KEY', 'fake-linear-key')
    vi.stubEnv('APP_ENV', 'production')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('on success', () => {
    it('should return 201 and file a Linear issue titled with the bank and message excerpt', async () => {
      const res = await createFakeClient().createfailedpastereport.$post({ json: fakeReport })

      expect(res.status).toBe(STATUS_CREATED_201)
      expect(mockCreateLinearIssue).toHaveBeenCalledTimes(1)
      expect(mockCreateLinearIssue.mock.calls[0][0]).toMatchObject({
        apiKey: 'fake-linear-key',
        title:
          'Failed Add Data Paste Report: CIBC – The amounts came through as income instead of expenses',
        labelNames: ['failed-paste-report', 'Bug'],
      })
    })

    it('should cut a long message down at the last word within 60 characters in the title', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: {
          ...fakeReport,
          message:
            '  Every   row from my chequing account was\nmissing, and the dates were all from last year too  ',
        },
      })

      expect(mockCreateLinearIssue.mock.calls[0][0].title).toBe(
        'Failed Add Data Paste Report: CIBC – Every row from my chequing account was missing, and the…',
      )
    })

    it('should name the bank the user typed in the title when they picked Other', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: {
          ...fakeReport,
          bank: 'Other',
          otherBankName: 'Tangerine',
          message: 'Nothing added',
        },
      })

      expect(mockCreateLinearIssue.mock.calls[0][0].title).toBe(
        'Failed Add Data Paste Report: Other: Tangerine – Nothing added',
      )
    })

    it('should describe the report, quoting the message and stamping when it was reported', async () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date('2026-10-12T09:35:00.000Z'))

      await createFakeClient().createfailedpastereport.$post({
        json: { ...fakeReport, message: 'Income instead of expenses.\nAll four rows.' },
      })
      vi.useRealTimers()

      expect(mockCreateLinearIssue.mock.calls[0][0].description).toBe(
        [
          '## What went wrong',
          '',
          '> Income instead of expenses.',
          '> All four rows.',
          '',
          '## Report details',
          '',
          '- **Bank:** CIBC',
          '- **App Version:** 0.1.45',
          '- **Environment:** production',
          '- **User ID:** 123e4567-e89b-12d3-a456-426614174000',
          '- **Account ID:** 123e4567-e89b-12d3-a456-426614174001',
          '- **User agent:** Mozilla/5.0 (X11; Linux x86_64) Firefox/131.0',
          '- **Pasted at:** 2026-10-12T09:30:00.000Z',
          '- **Reported at:** 2026-10-12T09:35:00.000Z',
          '- **Clipboard formats:** text/html, text/plain',
          '- **Expenses added:** 0',
          '- **Incomes added:** 4',
        ].join('\n'),
      )
    })

    it.each([
      ['dev', '[dev] '],
      ['local', '[local] '],
    ])('should prefix the title outside production (%s)', async (appEnv, expectedPrefix) => {
      vi.stubEnv('APP_ENV', appEnv)

      await createFakeClient().createfailedpastereport.$post({
        json: { ...fakeReport, message: 'Nothing added' },
      })

      expect(mockCreateLinearIssue.mock.calls[0][0].title).toBe(
        `${expectedPrefix}Failed Add Data Paste Report: CIBC – Nothing added`,
      )
    })

    it('should take the user and account from the session, ignoring any IDs in the body', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: {
          ...fakeReport,
          userId: 'someone-elses-user-id',
          accountId: 'someone-elses-account-id',
        },
      })

      const { description } = mockCreateLinearIssue.mock.calls[0][0]
      expect(description).toContain(`- **User ID:** ${fakeSessionUser.id}`)
      expect(description).toContain(`- **Account ID:** ${fakeSessionUser.accountId}`)
      expect(description).not.toContain('someone-elses')
    })
  })

  describe('when reporting is not configured', () => {
    it('should return 503 with a clear error and file nothing when there is no Linear API key', async () => {
      vi.stubEnv('LINEAR_API_KEY', '')

      const res = await createFakeClient().createfailedpastereport.$post({ json: fakeReport })

      expect(res.status).toBe(STATUS_SERVICE_UNAVAILABLE_503)
      expect(await res.json()).toEqual({ error: "Reporting isn't configured" })
      expect(mockCreateLinearIssue).not.toHaveBeenCalled()
    })
  })

  describe('when Linear fails', () => {
    it('should return 500 with the error message', async () => {
      mockCreateLinearIssue.mockRejectedValue(new Error('Linear request failed (500)'))

      const res = await createFakeClient().createfailedpastereport.$post({ json: fakeReport })

      expect(res.status).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
      expect(await res.json()).toEqual({ error: 'Linear request failed (500)' })
    })
  })

  describe('on invalid input', () => {
    it.each([
      ['a bank outside the list', { bank: 'Tangerine' }],
      ['Other without a bank name', { bank: 'Other' }],
      ['Other with a blank bank name', { bank: 'Other', otherBankName: '   ' }],
      [
        'Other with a bank name over 100 characters',
        { bank: 'Other', otherBankName: 'x'.repeat(101) },
      ],
      ['a whitespace-only message', { message: '  \n ' }],
      ['a message over 2000 characters', { message: 'x'.repeat(2001) }],
      ['a missing App Version', { appVersion: undefined }],
      ['a negative expense count', { expenseCount: -1 }],
    ])('should return 422 and file nothing for %s', async (_case, override) => {
      const res = await createFakeClient().createfailedpastereport.$post({
        json: { ...fakeReport, ...override },
      })

      expect(res.status).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
      expect(await res.json()).toEqual({ error: expect.any(String) })
      expect(mockCreateLinearIssue).not.toHaveBeenCalled()
    })

    it('should accept a 2000 character message once surrounding whitespace is trimmed', async () => {
      const res = await createFakeClient().createfailedpastereport.$post({
        json: { ...fakeReport, message: `  ${'x'.repeat(2000)}  ` },
      })

      expect(res.status).toBe(STATUS_CREATED_201)
    })
  })
})
