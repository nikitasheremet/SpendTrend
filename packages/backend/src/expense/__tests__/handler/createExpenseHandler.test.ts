import { createExpenseService } from '../../service/createExpenseService'
import { validateCreateExpenseInput } from '../../validation/'
import { Hono } from 'hono'
import { STATUS_CREATED_201 } from '../../../models/statusCodes'
import { createExpenseHandler } from '../../handler/createExpenseHandler'
import { testClient } from 'hono/testing'

vi.mock('../../service/createExpenseService')
vi.mock('../../validation')

const mockService = createExpenseService as Mock
const mockValidation = validateCreateExpenseInput as Mock

describe('createExpenseHandler', () => {
  const fakeApp = new Hono().post('/createexpense', createExpenseHandler)
  const fakeClient = testClient(fakeApp)
  const fakeRequestBody = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    accountId: '123e4567-e89b-12d3-a456-426614174001',
    expensesToCreate: [
      {
        name: 'Lunch',
        amount: 10,
        netAmount: 10,
        date: '2026-01-01',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        paidBackAmount: 0,
      },
    ],
  }

  beforeEach(() => {
    mockService.mockReset()
    mockValidation.mockReset()
  })

  describe('on success', () => {
    it('should return 201 and expense', async () => {
      // Arrange
      mockService.mockResolvedValue([{ id: 1, name: 'Lunch' }])

      // Act
      const res = await fakeClient.createexpense.$post({ json: fakeRequestBody })
      // Assert
      expect(res.status).toBe(STATUS_CREATED_201)
      const body = await res.json()
      expect(body).toEqual({ createdExpenses: [{ id: 1, name: 'Lunch' }] })
    })
  })

  describe('on validation error', () => {
    it('should return status code and error message', async () => {
      const fakeValidationError = new Error('Invalid input')
      mockValidation.mockImplementation(() => {
        throw fakeValidationError
      })
      const res = await fakeClient.createexpense.$post({ json: fakeRequestBody })
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
      const res = await fakeClient.createexpense.$post({ json: fakeRequestBody })
      expect(res.status).not.toBeUndefined()
      const body = await res.json()
      expect(body).toEqual({ error: fakeServiceError.message })
    })
  })
})
