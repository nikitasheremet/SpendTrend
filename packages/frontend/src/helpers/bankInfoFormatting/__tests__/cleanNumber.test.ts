import { describe, it, expect } from 'vitest'
import { cleanNumber } from '../cleanNumber'

describe('cleanNumber', () => {
  describe('when value is a valid positive number without special characters', () => {
    it('should return the number', () => {
      expect(cleanNumber('123.45')).toBe(123.45)
    })
  })

  describe('when value contains a dollar sign', () => {
    it('should remove the dollar sign and return the number', () => {
      expect(cleanNumber('$123.45')).toBe(123.45)
    })
  })

  describe('when value contains commas', () => {
    it('should remove the commas and return the number', () => {
      expect(cleanNumber('1,234.56')).toBe(1234.56)
    })
  })

  describe('when value contains an en dash as minus sign', () => {
    it('should remove the en dash and return the absolute value', () => {
      expect(cleanNumber('−123.45')).toBe(123.45)
    })
  })

  describe('when value is a negative number with hyphen', () => {
    it('should return the absolute value', () => {
      expect(cleanNumber('-123.45')).toBe(123.45)
    })
  })

  describe('when value contains multiple special characters', () => {
    it('should clean all and return the absolute number', () => {
      expect(cleanNumber('$1,234.56')).toBe(1234.56)
      expect(cleanNumber('−1,234.56')).toBe(1234.56)
      expect(cleanNumber('$−1,234.56')).toBe(1234.56)
    })
  })

  describe('when value is not a valid number', () => {
    it('should return undefined', () => {
      expect(cleanNumber('abc')).toBeUndefined()
      expect(cleanNumber('')).toBeUndefined()
      expect(cleanNumber('$')).toBeUndefined()
      expect(cleanNumber(',')).toBeUndefined()
      expect(cleanNumber('−')).toBeUndefined()
      expect(cleanNumber('NaN')).toBeUndefined()
    })
  })

  describe('when value contains spaces or other non-numeric characters', () => {
    it('should attempt to parse and return if valid, else undefined', () => {
      expect(cleanNumber('123 456')).toBe(123) // parseFloat stops at space
      expect(cleanNumber('abc123')).toBeUndefined()
    })
  })

  describe('when value is Infinity', () => {
    it('should return Infinity', () => {
      expect(cleanNumber('Infinity')).toBe(Infinity)
    })
  })
})
