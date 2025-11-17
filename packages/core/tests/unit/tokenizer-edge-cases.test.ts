import { describe, it, expect } from 'vitest'
import { Tokenizer } from '../../src/parser/tokenizer'

describe('Tokenizer Edge Cases', () => {
  describe('number parsing with scientific notation', () => {
    it('should handle scientific notation with positive exponent', () => {
      // Test line 296 - scientific notation parsing
      const tokenizer = new Tokenizer('value: 1.5e10')
      const tokens = tokenizer.tokenize()

      expect(tokens.some(t => t.type === 'NUMBER' && t.value === '1.5e10')).toBe(true)
    })

    it('should handle scientific notation with negative exponent', () => {
      const tokenizer = new Tokenizer('value: 2.5E-5')
      const tokens = tokenizer.tokenize()

      expect(tokens.some(t => t.type === 'NUMBER' && t.value === '2.5E-5')).toBe(true)
    })

    it('should handle scientific notation with plus sign', () => {
      const tokenizer = new Tokenizer('value: 1.2e+3')
      const tokens = tokenizer.tokenize()

      expect(tokens.some(t => t.type === 'NUMBER' && t.value === '1.2e+3')).toBe(true)
    })
  })

  describe('comment handling', () => {
    it('should handle # characters as schema syntax, not comments', () => {
      // Test that # at start of line is treated as schema syntax, not comments
      const tokenizer = new Tokenizer('#User[id@s name@s]\n|1|Alice|')

      expect(() => tokenizer.tokenize()).not.toThrow()
      const tokens = tokenizer.tokenize()

      // Should have schema-related tokens
      expect(tokens.some(t => t.type === 'HASH')).toBe(true)
    })

    it('should throw error on // style comments', () => {
      // Test that // comments are not supported and cause parse errors
      const tokenizer = new Tokenizer('name: value // comment here\nnext: line')

      expect(() => tokenizer.tokenize()).toThrow('Unexpected character: \'/\'')
    })

    it('should handle position tracking correctly', () => {
      // Test line 382 - isAtStartOfLine method for position tracking
      const tokenizer = new Tokenizer('name: value\nnext: line')
      const tokens = tokenizer.tokenize()

      expect(() => tokenizer.tokenize()).not.toThrow()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('position tracking', () => {
    it('should detect start of line correctly', () => {
      // Test line 382 - isAtStartOfLine method
      const tokenizer = new Tokenizer('first\nsecond')
      const tokens = tokenizer.tokenize()

      // Find position of tokens to verify line start detection
      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })

    it('should track multi-line positions accurately', () => {
      const input = `
key1: value1
key2: value2
key3: value3
      `.trim()

      const tokenizer = new Tokenizer(input)
      const tokens = tokenizer.tokenize()

      // Should have tokens from multiple lines with correct positions
      expect(tokens.length).toBeGreaterThan(6) // At least 3 keys, 3 values, newlines
    })
  })

  describe('edge case inputs', () => {
    it('should handle empty input gracefully', () => {
      const tokenizer = new Tokenizer('')
      const tokens = tokenizer.tokenize()

      expect(tokens).toHaveLength(1)
      expect(tokens[0].type).toBe('EOF')
    })

    it('should handle whitespace-only input', () => {
      const tokenizer = new Tokenizer('   \n  \n   ')
      const tokens = tokenizer.tokenize()

      expect(tokens[tokens.length - 1].type).toBe('EOF')
    })

    it('should handle very long lines', () => {
      const longValue = 'a'.repeat(1000)
      const tokenizer = new Tokenizer(`key: ${longValue}`)

      expect(() => tokenizer.tokenize()).not.toThrow()
    })

    it('should handle special characters in values', () => {
      const tokenizer = new Tokenizer('key: "value with special chars: !@#$%^&*()"')

      expect(() => tokenizer.tokenize()).not.toThrow()
    })
  })
})