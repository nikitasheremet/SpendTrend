export class HttpError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`HTTP Error: Status: ${status}`)
    this.name = 'HttpError'
    this.status = status
  }
}
