import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { formatDate, DateFormat } from '../formatDate'

describe('formatDate', () => {
  const originalTZ = process.env.TZ

  beforeAll(() => {
    process.env.TZ = 'UTC'
  })

  afterAll(() => {
    process.env.TZ = originalTZ
  })

  describe('when formatting to YYYY-MM-DD', () => {
    it('should format a Date object correctly', () => {
      const fakeDate = new Date('2025-12-17T10:30:00Z')
      const result = formatDate(fakeDate, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2025-12-17')
    })

    it('should format a date string correctly', () => {
      const fakeDateString = 'December 17, 2025'
      const result = formatDate(fakeDateString, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2025-12-17')
    })

    it('should format a timestamp correctly', () => {
      const fakeTimestamp = new Date('2025-12-17T00:00:00Z').getTime()
      const result = formatDate(fakeTimestamp, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2025-12-17')
    })
  })

  describe('when formatting to DD-MMMM-YYYY', () => {
    it('should format a Date object correctly', () => {
      const fakeDate = new Date('2025-12-17T10:30:00Z')
      const result = formatDate(fakeDate, DateFormat.DD_MMMM_YYYY)
      expect(result).toMatch(/December 17, 2025/)
    })

    it('should format a date string correctly', () => {
      const fakeDateString = '2025-12-17'
      const result = formatDate(fakeDateString, DateFormat.DD_MMMM_YYYY)
      expect(result).toMatch(/December 17, 2025/)
    })
  })

  describe('when using ignoreTimezone option', () => {
    it('should parse YYYY-MM-DD format without timezone conversion', () => {
      const fakeDateString = '2025-12-17'
      const result = formatDate(fakeDateString, DateFormat.YYYY_MM_DD, {
        ignoreTimezone: true,
      })
      expect(result).toBe('2025-12-17')
    })

    it('should handle non YYYY-MM-DD format normally when ignoreTimezone is true', () => {
      const fakeDateString = 'December 17, 2025'
      const result = formatDate(fakeDateString, DateFormat.YYYY_MM_DD, {
        ignoreTimezone: true,
      })
      expect(result).toBe('2025-12-17')
    })
  })

  describe('when handling malformed date strings', () => {
    it('should correctly parse date with missing space between day and year', () => {
      const fakeMalformedDate = 'December 172025'
      const result = formatDate(fakeMalformedDate, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2025-12-17')
    })

    it('should handle single digit day with missing space', () => {
      const fakeMalformedDate = 'January 12025'
      const result = formatDate(fakeMalformedDate, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2025-01-01')
    })

    it('should format malformed date to DD-MMMM-YYYY correctly', () => {
      const fakeMalformedDate = 'December 172025'
      const result = formatDate(fakeMalformedDate, DateFormat.DD_MMMM_YYYY)
      expect(result).toMatch(/December 17, 2025/)
    })
  })

  describe('when using invalid format', () => {
    it('should return date.toString() for unrecognized format', () => {
      const fakeDate = new Date('2025-12-17T10:30:00Z')
      // @ts-expect-error Testing invalid format
      const result = formatDate(fakeDate, 'INVALID_FORMAT')
      expect(result).toContain('2025')
    })
  })

  describe('when handling edge cases', () => {
    it('should handle leap year dates', () => {
      const fakeLeapYearDate = '2024-02-29'
      const result = formatDate(fakeLeapYearDate, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2024-02-29')
    })

    it('should handle first day of year', () => {
      const fakeNewYearDate = '2025-01-01'
      const result = formatDate(fakeNewYearDate, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2025-01-01')
    })

    it('should handle last day of year', () => {
      const fakeEndYearDate = '2025-12-31'
      const result = formatDate(fakeEndYearDate, DateFormat.YYYY_MM_DD)
      expect(result).toBe('2025-12-31')
    })
  })
})
