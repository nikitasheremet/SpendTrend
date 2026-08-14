import { describe, it, expect } from 'vitest'
import { toTitleCase } from '../toTitleCase'

describe('toTitleCase', () => {
  describe('when value is lowercase', () => {
    it('should capitalize the first letter of each word', () => {
      expect(toTitleCase('grocery store')).toBe('Grocery Store')
    })
  })

  describe('when value is uppercase', () => {
    it('should lowercase the remaining letters of each word', () => {
      expect(toTitleCase('GROCERY STORE')).toBe('Grocery Store')
    })
  })

  describe('when value is a single word', () => {
    it('should capitalize just that word', () => {
      expect(toTitleCase('utilities')).toBe('Utilities')
    })
  })

  describe('when value has leading, trailing, or repeated whitespace', () => {
    it('should trim and collapse whitespace between words', () => {
      expect(toTitleCase('  credit   card  ')).toBe('Credit Card')
    })
  })

  describe('when value is already title cased', () => {
    it('should leave it unchanged', () => {
      expect(toTitleCase('Eating Out')).toBe('Eating Out')
    })
  })

  describe('when value is an empty or whitespace-only string', () => {
    it('should return an empty string', () => {
      expect(toTitleCase('')).toBe('')
      expect(toTitleCase('   ')).toBe('')
    })
  })

  describe('when a word contains an apostrophe', () => {
    it('should only capitalize the first letter of the word', () => {
      expect(toTitleCase("trader joe's")).toBe("Trader Joe's")
    })
  })
})
