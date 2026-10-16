export const REPORTING_NOT_CONFIGURED = "Reporting isn't configured"

export class ReportingNotConfiguredError extends Error {
  constructor() {
    super(REPORTING_NOT_CONFIGURED)
    this.name = 'ReportingNotConfiguredError'
  }
}
