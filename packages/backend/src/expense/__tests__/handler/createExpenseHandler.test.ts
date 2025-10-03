import { createExpenseService } from '../../service/createExpenseService'
import { validateCreateExpenseInput } from '../../validation/'
import { Hono } from 'hono'
import { STATUS_CREATED_201 } from '../../../models/statusCodes'
import { createExpenseHandler } from '../../handler/createExpenseHandler'
import { testClient } from 'hono/testing'

jest.mock('../../service/createExpenseService')
jest.mock('../../validation')

const mockService = createExpenseService as jest.Mock
const mockValidation = validateCreateExpenseInput as jest.Mock

describe('createExpenseHandler', () => {
  const fakeApp = new Hono().post('/createexpense', createExpenseHandler)
  const fakeClient = testClient(fakeApp)

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  describe('on success', () => {
    it('should return 201 and expense', async () => {
      // Arrange
      mockService.mockResolvedValue({ id: 1, name: 'Lunch' })

      // Act
      const res = await fakeClient.createexpense.$post()
      // Assert
      expect(res.status).toBe(STATUS_CREATED_201)
      const body = await res.json()
      expect(body).toEqual({ createdExpense: { id: 1, name: 'Lunch' } })
    })
  })

  describe('on validation error', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      const res = await fakeClient.createexpense.$post()
      expect(res.status).not.toBeUndefined()
      const body = await res.json()
      expect(body).toEqual({ error: fakeValidationError.message })
    })
  })

  describe('on service error', () => {
    it('should return status code and error message', async () => {
      const fakeServiceError = new Error('Service error')
      mockService.mockImplementation(() => {
        throw fakeServiceError
      })
      const res = await fakeClient.createexpense.$post()
      expect(res.status).not.toBeUndefined()
      const body = await res.json()
      expect(body).toEqual({ error: fakeServiceError.message })
    })
  })
})
