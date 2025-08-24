export const DB_ERROR = 'Database Error'
export const NOT_FOUND_ERROR = 'Not Found Error'

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RepositoryError'
  }
}
