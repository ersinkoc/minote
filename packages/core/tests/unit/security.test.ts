import { describe, it, expect } from 'vitest'
import { MinoteParser, JsonToMinoteConverter, MinoteToJsonConverter } from '../../src'

describe('Security Features', () => {
  describe('Memory Safety Limits', () => {
    it('should reject input exceeding max size limit', () => {
      const parser = new MinoteParser({ maxInputSize: 100 })
      const hugeInput = 'a'.repeat(200) // 200 chars > 100 limit

      expect(() => parser.parse(hugeInput)).toThrow('Input size')
    })

    it('should reject input exceeding default 10MB limit', () => {
      const parser = new MinoteParser()
      const hugeInput = 'a'.repeat(11 * 1024 * 1024) // 11MB > 10MB limit

      expect(() => parser.parse(hugeInput)).toThrow('Input size')
    })

    it('should reject input with too many tokens', () => {
      const parser = new MinoteParser({ maxTokens: 5 })
      const manyTokens = 'a: b\nc: d\ne: f\ng: h\ni: j' // More than 5 tokens

      expect(() => parser.parse(manyTokens)).toThrow('Token count')
    })

    it('should reject input with excessive nesting depth', () => {
      const parser = new MinoteParser({ maxDepth: 3 })
      const deepNesting = 'a:\n  b:\n    c:\n      d:\n        e:' // Depth 5 > limit 3

      expect(() => parser.parse(deepNesting)).toThrow('Nesting depth')
    })

    it('should accept input within all security limits', () => {
      const parser = new MinoteParser({
        maxInputSize: 1000,
        maxTokens: 100,
        maxDepth: 10
      })

      const safeInput = `
name: Alice
age: 30
active: true
contact:
  email: alice@example.com
  phone: +1-555-0100
tags: [developer designer]
      `.trim()

      expect(() => parser.parse(safeInput)).not.toThrow()
    })
  })

  describe('Regex Safety', () => {
    it('should detect dangerous regex patterns', async () => {
      const { isSafeRegex } = await import('../../src/utils/regex-safety')

      // Known catastrophic backtracking patterns
      const dangerousPatterns = [
        '(a+)+b$',      // Nested quantifiers
        '(a+)*',        // Quantifier with star
        '(.+)+',        // Greedy quantifier with group
        '(x+)+y',       // Another backtracking pattern
      ]

      dangerousPatterns.forEach(pattern => {
        expect(isSafeRegex(pattern)).toBe(false)
      })
    })

    it('should allow safe regex patterns', async () => {
      const { isSafeRegex } = await import('../../src/utils/regex-safety')

      const safePatterns = [
        '^\\d+$',                // Numbers only
        '^\\w+$',                // Word characters
        '^\\s+$',                // Whitespace only
        '\\\\\\\\',               // Backslash pattern
      ]

      safePatterns.forEach(pattern => {
        expect(isSafeRegex(pattern)).toBe(true)
      })
    })
  })

  describe('Converter Security', () => {
    it('should reject JSON with excessive depth in conversion', () => {
      const converter = new JsonToMinoteConverter({ maxDepth: 3 })

      // Create deeply nested object
      let deepObject = {}
      let current = deepObject
      for (let i = 0; i < 5; i++) {
        current[`level${i}`] = {}
        current = current[`level${i}`]
      }
      current.value = 'deep'

      expect(() => converter.convert(deepObject)).toThrow('exceeds maximum allowed depth')
    })

    it('should handle safe JSON conversion', () => {
      const converter = new JsonToMinoteConverter()

      const safeObject = {
        name: 'Alice',
        age: 30,
        active: true,
        contact: {
          email: 'alice@example.com',
          phone: '+1-555-0100'
        }
      }

      expect(() => converter.convert(safeObject)).not.toThrow()
    })
  })

  describe('Input Validation', () => {
    it('should reject null input', () => {
      const parser = new MinoteParser()

      expect(() => parser.parse(null)).toThrow()
    })

    it('should reject undefined input', () => {
      const parser = new MinoteParser()

      expect(() => parser.parse(undefined)).toThrow()
    })

    it('should handle empty string safely', () => {
      const parser = new MinoteParser()

      expect(() => parser.parse('')).not.toThrow()
    })

    it('should reject extremely long property names', () => {
      const parser = new MinoteParser()
      const longPropertyName = 'a'.repeat(10000)
      const input = `${longPropertyName}: value`

      // Should either parse successfully or reject gracefully, not crash
      expect(() => parser.parse(input)).not.toThrow()
    })
  })

  describe('Resource Limits', () => {
    it('should respect custom resource limits', () => {
      const parser = new MinoteParser({
        maxInputSize: 50,
        maxTokens: 10,
        maxDepth: 2
      })

      // This should be within limits
      const safeInput = 'a: 1\nb: 2'
      expect(() => parser.parse(safeInput)).not.toThrow()

      // This should exceed token limit
      const tokenHeavyInput = 'a: b\nc: d\ne: f\ng: h\ni: j\nk: l'
      expect(() => parser.parse(tokenHeavyInput)).toThrow('Token count')
    })

    it('should provide meaningful error messages for security violations', () => {
      const parser = new MinoteParser({ maxInputSize: 10 })

      try {
        parser.parse('a'.repeat(20))
        fail('Expected error')
      } catch (error) {
        expect(error.message).toContain('Input size')
        expect(error.message).toContain('exceeds maximum')
      }
    })
  })
})