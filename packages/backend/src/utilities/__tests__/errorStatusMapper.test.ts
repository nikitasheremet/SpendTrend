import { ValidationError } from '../../models/errors/validationError'
import {
  STATUS_UNPROCESSABLE_ENTITY_422,
  STATUS_INTERNAL_SERVER_ERROR_500,
} from '../../models/statusCodes'
import { errorStatusMapper } from '../errorStatusMapper'

describe('errorStatusMapper', () => {
  describe('when error is ValidationError', () => {
    it('returns 422', () => {
      const error = new ValidationError('Invalid input')
      const status = errorStatusMapper(error)
      expect(status).toBe(STATUS_UNPROCESSABLE_ENTITY_422)
    })
  })
  describe('when error is a regular Error', () => {
    it('returns 500', () => {
      const error = new Error('Something went wrong')
      const status = errorStatusMapper(error)
      expect(status).toBe(STATUS_INTERNAL_SERVER_ERROR_500)
    })
  })
})
