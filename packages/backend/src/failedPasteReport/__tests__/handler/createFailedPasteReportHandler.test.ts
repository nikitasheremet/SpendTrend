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
  expenseCount: 1,
  incomeCount: 1,
  scrambledHtml:
    '<html><head></head><body><table><tbody><tr><td>Jan 15, 2026</td></tr></tbody></table></body></html>',
  scrambledText: 'Jan 15, 2026\tAaaaaa\t$1.00',
  parsedRows: [
    { type: 'expense', date: '2026-01-15', name: 'Aaaaaa Aaaa', amount: 1.1 },
    { type: 'income', name: 'Aaaaaa', amount: 1100 },
  ],
  fidelity: {
    original: { rowCount: 2, expenseCount: 1, incomeCount: 1, rowsWithoutDate: 1 },
    scrambled: { rowCount: 2, expenseCount: 1, incomeCount: 1, rowsWithoutDate: 1 },
    matches: true,
  },
  isTruncated: false,
  areParsedRowsTruncated: false,
}

const MAX_SCRAMBLED_PASTE_LENGTH = 2 * 1024 * 1024

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

    it('should describe the report, quoting the message, stamping when it was reported and listing the parsed rows', async () => {
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
          '- **Expenses added:** 1',
          '- **Incomes added:** 1',
          '- **Paste truncated:** No',
          '',
          '## Fidelity check',
          '',
          'The scrambled paste parses the same way as the original.',
          '',
          '| | Original | Scrambled |',
          '| --- | --- | --- |',
          '| Rows | 2 | 2 |',
          '| Expenses | 1 | 1 |',
          '| Incomes | 1 | 1 |',
          '| Rows with no date | 1 | 1 |',
          '',
          '## Parsed rows',
          '',
          'From parsing the scrambled HTML.',
          '',
          '| # | Date | Name | Type | Amount |',
          '| --- | --- | --- | --- | --- |',
          '| 1 | 2026-01-15 | Aaaaaa Aaaa | expense | 1.1 |',
          '| 2 | — | Aaaaaa | income | 1100 |',
        ].join('\n'),
      )
    })

    it('should warn when scrambling changed how the paste parses', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: {
          ...fakeReport,
          fidelity: {
            ...fakeReport.fidelity,
            scrambled: { rowCount: 1, expenseCount: 1, incomeCount: 0, rowsWithoutDate: 0 },
            matches: false,
          },
        },
      })

      const { description } = mockCreateLinearIssue.mock.calls[0][0]
      expect(description).toContain(
        '⚠️ Scrambling changed how the paste parses, so this report may not reproduce the problem.',
      )
      expect(description).toContain('| Rows | 2 | 1 |')
      expect(description).toContain('| Incomes | 1 | 0 |')
      expect(description).not.toContain('parses the same way')
    })

    it('should say when the paste was truncated', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: { ...fakeReport, isTruncated: true },
      })

      expect(mockCreateLinearIssue.mock.calls[0][0].description).toContain(
        '- **Paste truncated:** Yes',
      )
    })

    it('should keep row names from breaking the parsed rows table', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: {
          ...fakeReport,
          parsedRows: [{ type: 'expense', name: 'Aaaa | Aaa\nAaaa \\', amount: 1 }],
        },
      })

      expect(mockCreateLinearIssue.mock.calls[0][0].description).toContain(
        '| 1 | — | Aaaa \\| Aaa Aaaa \\\\ | expense | 1 |',
      )
    })

    it('should say when the parsed rows were cut down', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: {
          ...fakeReport,
          fidelity: {
            ...fakeReport.fidelity,
            scrambled: { rowCount: 900, expenseCount: 400, incomeCount: 500, rowsWithoutDate: 0 },
          },
          areParsedRowsTruncated: true,
        },
      })

      expect(mockCreateLinearIssue.mock.calls[0][0].description).toContain(
        [
          'From parsing the scrambled HTML.',
          '',
          '⚠️ Cut down to at most 500 rows, with names up to 200 characters. The scrambled HTML parses to 900 rows.',
          '',
          '| # | Date | Name | Type | Amount |',
        ].join('\n'),
      )
    })

    it('should say when no rows were parsed', async () => {
      await createFakeClient().createfailedpastereport.$post({
        json: { ...fakeReport, parsedRows: [] },
      })

      expect(mockCreateLinearIssue.mock.calls[0][0].description).toMatch(
        /## Parsed rows\n\nNo rows were parsed from the scrambled HTML\.$/,
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

    it('should attach exactly the scrambled HTML, the scrambled text and the report, with the paste exactly as sent', async () => {
      await createFakeClient().createfailedpastereport.$post({ json: fakeReport })

      const { attachments } = mockCreateLinearIssue.mock.calls[0][0]
      expect(attachments.map((file) => file.filename)).toEqual([
        'pasted.scrambled.html',
        'pasted.scrambled.txt',
        'report.json',
      ])
      expect(attachments).toContainEqual({
        filename: 'pasted.scrambled.html',
        contentType: 'text/html',
        content: fakeReport.scrambledHtml,
      })
      expect(attachments).toContainEqual({
        filename: 'pasted.scrambled.txt',
        contentType: 'text/plain',
        content: fakeReport.scrambledText,
      })
    })

    it('should attach the validated report as JSON, stamped with who reported it, where and when', async () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date('2026-10-12T09:35:00.000Z'))

      await createFakeClient().createfailedpastereport.$post({
        json: {
          ...fakeReport,
          message: '  Nothing added  ',
          userId: 'someone-elses-user-id',
          unexpectedField: 'dropped',
        },
      })
      vi.useRealTimers()

      const reportFile = mockCreateLinearIssue.mock.calls[0][0].attachments.find(
        (file) => file.filename === 'report.json',
      )
      expect(reportFile?.contentType).toBe('application/json')
      expect(JSON.parse(reportFile?.content ?? '')).toEqual({
        ...fakeReport,
        message: 'Nothing added',
        userId: fakeSessionUser.id,
        accountId: fakeSessionUser.accountId,
        environment: 'production',
        reportedAt: '2026-10-12T09:35:00.000Z',
      })
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

  describe('when the Linear API key is debug_only_print', () => {
    beforeEach(() => {
      vi.stubEnv('LINEAR_API_KEY', 'debug_only_print')
    })

    it('should return 201 and log the issue it would have filed instead of sending it outside production', async () => {
      vi.stubEnv('APP_ENV', 'local')
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const res = await createFakeClient().createfailedpastereport.$post({ json: fakeReport })

      expect(res.status).toBe(STATUS_CREATED_201)
      expect(mockCreateLinearIssue).not.toHaveBeenCalled()
      const loggedOutput = consoleLogSpy.mock.calls.flat().join('\n')
      expect(loggedOutput).toContain(
        '[local] Failed Add Data Paste Report: CIBC – The amounts came through as income instead of expenses',
      )
      expect(loggedOutput).toContain('- **Account ID:** 123e4567-e89b-12d3-a456-426614174001')
      expect(loggedOutput).toContain('failed-paste-report, Bug')
      consoleLogSpy.mockRestore()
    })

    it('should return 503 and neither log nor file the issue in production', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const res = await createFakeClient().createfailedpastereport.$post({ json: fakeReport })

      expect(res.status).toBe(STATUS_SERVICE_UNAVAILABLE_503)
      expect(await res.json()).toEqual({ error: "Reporting isn't configured" })
      expect(mockCreateLinearIssue).not.toHaveBeenCalled()
      expect(consoleLogSpy).not.toHaveBeenCalled()
      consoleLogSpy.mockRestore()
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
      ['missing scrambled HTML', { scrambledHtml: undefined }],
      ['missing scrambled text', { scrambledText: undefined }],
      ['scrambled HTML over 2 MB', { scrambledHtml: 'x'.repeat(MAX_SCRAMBLED_PASTE_LENGTH + 1) }],
      ['scrambled text over 2 MB', { scrambledText: 'x'.repeat(MAX_SCRAMBLED_PASTE_LENGTH + 1) }],
      ['parsed rows that are not a list', { parsedRows: 'none' }],
      [
        'a parsed row with an unknown type',
        { parsedRows: [{ type: 'transfer', name: 'Aaa', amount: 1 }] },
      ],
      ['a parsed row without an amount', { parsedRows: [{ type: 'expense', name: 'Aaa' }] }],
      ['a missing fidelity check', { fidelity: undefined }],
      [
        'a fidelity check without matches',
        { fidelity: { ...fakeReport.fidelity, matches: undefined } },
      ],
      [
        'a fidelity check with a negative count',
        {
          fidelity: {
            ...fakeReport.fidelity,
            original: { ...fakeReport.fidelity.original, rowsWithoutDate: -1 },
          },
        },
      ],
      ['a missing truncated flag', { isTruncated: undefined }],
      ['a missing parsed rows truncated flag', { areParsedRowsTruncated: undefined }],
      [
        'more than 500 parsed rows',
        { parsedRows: Array(501).fill({ type: 'expense', name: 'Aaa', amount: 1 }) },
      ],
      [
        'a parsed row name over 200 characters',
        { parsedRows: [{ type: 'expense', name: 'A'.repeat(201), amount: 1 }] },
      ],
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
