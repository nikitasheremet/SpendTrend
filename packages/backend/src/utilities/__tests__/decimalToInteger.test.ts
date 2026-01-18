import { decimalToInteger } from '../decimalToInteger'

describe('when converting decimal amounts to integers', () => {
  it('should convert 37.87 to 3787', () => {
    const result = decimalToInteger(37.87)
    expect(result).toBe(3787)
  })

  it('should convert 10.5 to 1050', () => {
    const result = decimalToInteger(10.5)
    expect(result).toBe(1050)
  })

  it('should convert 9.5 to 950', () => {
    const result = decimalToInteger(9.5)
    expect(result).toBe(950)
  })

  it('should convert 5.0 to 500', () => {
    const result = decimalToInteger(5.0)
    expect(result).toBe(500)
  })

  it('should convert 100.99 to 10099', () => {
    const result = decimalToInteger(100.99)
    expect(result).toBe(10099)
  })

  it('should convert 0.01 to 1', () => {
    const result = decimalToInteger(0.01)
    expect(result).toBe(1)
  })

  it('should convert 0.99 to 99', () => {
    const result = decimalToInteger(0.99)
    expect(result).toBe(99)
  })

  it('should convert 1234.56 to 123456', () => {
    const result = decimalToInteger(1234.56)
    expect(result).toBe(123456)
  })

  it('should handle edge case with floating point precision for 0.07', () => {
    const result = decimalToInteger(0.07)
    expect(result).toBe(7)
  })

  it('should handle edge case with floating point precision for 0.14', () => {
    const result = decimalToInteger(0.14)
    expect(result).toBe(14)
  })
})
