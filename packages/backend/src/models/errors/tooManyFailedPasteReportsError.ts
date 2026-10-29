export class TooManyFailedPasteReportsError extends Error {
  readonly retryAfterSeconds: number

  constructor(reportsPerWindow: number, retryAfterSeconds: number) {
    super(`You've sent ${reportsPerWindow} reports in the last hour`)
    this.name = 'TooManyFailedPasteReportsError'
    this.retryAfterSeconds = retryAfterSeconds
  }
}
