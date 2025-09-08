import { Context } from 'koa'
import { ValidationError } from '../../../models/errors/validationError'
import { validateDeleteExpenseInput } from '../../validation/'
import { deleteExpenseHandler } from '../../handler/deleteExpenseHandler'
import { STATUS_SUCCESS_200 } from '../../../models/statusCodes'
import { deleteExpenseService } from '../../service/deleteExpenseService'

jest.mock('../../validation')
jest.mock('../../service/deleteExpenseService')

const mockValidation = validateDeleteExpenseInput as jest.Mock
const mockService = deleteExpenseService as jest.Mock

describe("deleteExpenseHandler", () => {
     const fakeCtx = {
        request: {
          body: {},
        },
        status: undefined,
        body: undefined,
      } as unknown as Context
    
      beforeEach(() => {
        //mockService.mockReset()
        jest.resetAllMocks()
      })

    describe("when input is invalid", () => {
        it("should throw a error status code and message", async () => {
            const mockValidationError = new ValidationError('Invalid input')
            mockValidation.mockImplementation(() => {
                throw mockValidationError
            })

            await deleteExpenseHandler(fakeCtx)
            
            expect(fakeCtx.status).not.toBe(STATUS_SUCCESS_200)
            expect(fakeCtx.body).toEqual({
                error: mockValidationError.message,
            })
        })
    })

    describe("when service logic fails", () => {
        it("should throw a error status code and message", async () => {
            const fakeServiceError = new ValidationError('Invalid input')
            mockService.mockImplementation(() => {
                throw fakeServiceError
            })

            await deleteExpenseHandler(fakeCtx)
            
            expect(fakeCtx.status).not.toBe(STATUS_SUCCESS_200)
            expect(fakeCtx.body).toEqual({
                error: fakeServiceError.message,
            })
        })
    })

    describe("on successful request", () => {
        it("should return status 200 and deleted expense", async () => {
            const fakeDeletedExpense = {id: 123}
            mockService.mockResolvedValue(fakeDeletedExpense)

            await deleteExpenseHandler(fakeCtx)
            
            expect(fakeCtx.status).toBe(STATUS_SUCCESS_200)
            expect(fakeCtx.body).toEqual({
                expense: fakeDeletedExpense,
            })
        })
    })
})