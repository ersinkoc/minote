import { describe, it, expect } from 'vitest'
import { ParseError } from '../../src/errors/parse-error'
import type { Position } from '../../src/types/ast'

describe('ParseError', () => {
  describe('constructor and basic properties', () => {
    it('should create ParseError with message and position', () => {
      const position: Position = {
        line: 1,
        column: 5,
        offset: 4
      }
      const error = new ParseError('Test error', position)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(ParseError)
      expect(error.name).toBe('ParseError')
      expect(error.message).toContain('Test error')
      expect(error.message).toContain('at line 1, column 5')
      expect(error.position).toEqual(position)
      expect(error.source).toBeUndefined()
    })

    it('should create ParseError with message, position, and source', () => {
      const position: Position = {
        line: 2,
        column: 10,
        offset: 15
      }
      const source = 'name: Alice\nage: 30'
      const error = new ParseError('Syntax error', position, source)

      expect(error.name).toBe('ParseError')
      expect(error.message).toContain('Syntax error')
      expect(error.message).toContain('at line 2, column 10')
      expect(error.position).toEqual(position)
      expect(error.source).toBe(source)
    })

    it('should create ParseError at first line', () => {
      const position: Position = {
        line: 1,
        column: 1,
        offset: 0
      }
      const error = new ParseError('Start error', position)

      expect(error.message).toContain('Start error')
      expect(error.message).toContain('at line 1, column 1')
      expect(error.position.line).toBe(1)
      expect(error.position.column).toBe(1)
    })

    it('should create ParseError at specific position', () => {
      const position: Position = {
        line: 10,
        column: 25,
        offset: 200
      }
      const error = new ParseError('Position error', position)

      expect(error.message).toContain('Position error')
      expect(error.message).toContain('at line 10, column 25')
      expect(error.position.line).toBe(10)
      expect(error.position.column).toBe(25)
    })
  })

  describe('toString method without source', () => {
    it('should format basic error without source', () => {
      const position: Position = {
        line: 1,
        column: 5,
        offset: 4
      }
      const error = new ParseError('Basic error', position)

      const result = error.toString()
      expect(result).toContain('ParseError: Basic error')
      expect(result).toContain('at line 1, column 5')
      expect(result).not.toContain('name: Alice')
      expect(result).not.toContain('^')
    })

    it('should handle empty source gracefully', () => {
      const position: Position = {
        line: 1,
        column: 1,
        offset: 0
      }
      const error = new ParseError('No source error', position, '')

      const result = error.toString()
      expect(result).toContain('ParseError: No source error')
      expect(result).toContain('at line 1, column 1')
    })
  })

  describe('toString method with source context', () => {
    it('should include source line in toString output', () => {
      const position: Position = {
        line: 1,
        column: 6,
        offset: 5
      }
      const source = 'name: Alice'
      const error = new ParseError('Expected value', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Expected value')
      expect(result).toContain('at line 1, column 6')
      expect(result).toContain('name: Alice')
      expect(result).toContain('^')
    })

    it('should show pointer at correct column position', () => {
      const position: Position = {
        line: 1,
        column: 3,
        offset: 2
      }
      const source = 'user: Bob'
      const error = new ParseError('Invalid character', position, source)

      const result = error.toString()
      expect(result).toContain('user: Bob')
      expect(result).toContain('^')

      // The pointer should be at column 3 (0-based index 2)
      const lines = result.split('\n')
      const pointerLine = lines.find(line => line.includes('^'))
      expect(pointerLine).toBeDefined()
      expect(pointerLine!.indexOf('^')).toBe(2) // Column 3 = index 2
    })

    it('should handle multiline source correctly', () => {
      const position: Position = {
        line: 2,
        column: 5,
        offset: 15
      }
      const source = 'name: Alice\nage: 30\nactive: true'
      const error = new ParseError('Missing colon', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Missing colon')
      expect(result).toContain('at line 2, column 5')
      expect(result).toContain('age: 30')
      expect(result).toContain('^')
      expect(result).not.toContain('name: Alice') // Should only show the error line
    })

    it('should handle position beyond source lines', () => {
      const position: Position = {
        line: 10,
        column: 1,
        offset: 100
      }
      const source = 'single line'
      const error = new ParseError('Out of bounds', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Out of bounds')
      expect(result).toContain('at line 10, column 1')
      // Should not include source line since line 10 doesn't exist
      expect(result).not.toContain('single line')
      expect(result).not.toContain('^')
    })

    it('should handle position at end of source line', () => {
      const position: Position = {
        line: 1,
        column: 12,
        offset: 11
      }
      const source = 'hello world'
      const error = new ParseError('Unexpected EOF', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Unexpected EOF')
      expect(result).toContain('hello world')
      expect(result).toContain('^')
    })

    it('should handle empty source line', () => {
      const position: Position = {
        line: 2,
        column: 1,
        offset: 10
      }
      const source = 'line 1\n\nline 3' // Empty line 2
      const error = new ParseError('Empty line error', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Empty line error')
      expect(result).toContain('at line 2, column 1')
      // Should handle empty line gracefully
      expect(result).not.toContain('\n^\n') // No pointer for empty line
    })

    it('should handle long source lines', () => {
      const position: Position = {
        line: 1,
        column: 50,
        offset: 49
      }
      const source = 'a'.repeat(100) // 100 character line
      const error = new ParseError('Long line error', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Long line error')
      expect(result).toContain('a'.repeat(100))
      expect(result).toContain('^')
    })
  })

  describe('error properties and inheritance', () => {
    it('should maintain proper error stack trace when available', () => {
      const position: Position = {
        line: 1,
        column: 1,
        offset: 0
      }
      const error = new ParseError('Stack test', position)

      // Should have stack property in environments that support it
      if (Error.captureStackTrace) {
        expect(error.stack).toBeDefined()
        expect(error.stack).toContain('ParseError')
        expect(error.stack).toContain('Stack test')
      }
    })

    it('should be properly catchable as Error', () => {
      const position: Position = {
        line: 1,
        column: 1,
        offset: 0
      }

      try {
        throw new ParseError('Catch test', position)
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect(e).toBeInstanceOf(ParseError)
        expect((e as ParseError).message).toContain('Catch test')
      }
    })

    it('should serialize correctly to JSON', () => {
      const position: Position = {
        line: 3,
        column: 7,
        offset: 25
      }
      const source = 'test: value'
      const error = new ParseError('JSON test', position, source)

      const serialized = JSON.parse(JSON.stringify(error))
      expect(serialized.name).toBe('ParseError')
      expect(serialized.position).toEqual(position)
      expect(serialized.source).toBe(source)
      if (serialized.message) {
        expect(serialized.message).toContain('JSON test')
      }
    })
  })

  describe('edge cases and special characters', () => {
    it('should handle special characters in error message', () => {
      const position: Position = {
        line: 1,
        column: 1,
        offset: 0
      }
      const error = new ParseError('Error with "quotes" and \n newlines', position)

      expect(error.message).toContain('Error with "quotes"')
      expect(error.message).toContain('at line 1, column 1')
    })

    it('should handle unicode characters in source', () => {
      const position: Position = {
        line: 1,
        column: 5,
        offset: 4
      }
      const source = '测试: 中文'
      const error = new ParseError('Unicode error', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Unicode error')
      expect(result).toContain('测试: 中文')
      expect(result).toContain('^')
    })

    it('should handle tabs and special whitespace in source', () => {
      const position: Position = {
        line: 1,
        column: 5,
        offset: 4
      }
      const source = 'name:\tAlice\nage: 30'
      const error = new ParseError('Tab error', position, source)

      const result = error.toString()
      expect(result).toContain('ParseError: Tab error')
      expect(result).toContain('name:\tAlice')
      expect(result).toContain('^')
    })

    it('should handle ParseError creation and properties', () => {
      // Test ParseError basic functionality
      const position = { line: 1, column: 5, offset: 4 }
      const error = new ParseError('Test error', position)

      expect(error.name).toBe('ParseError')
      expect(error.message).toContain('Test error')
      expect(error.position).toEqual(position)
    })

    it('should handle toString with position information', () => {
      // Test toString with position included in message
      const position = { line: 1, column: 5, offset: 4 }
      const error = new ParseError('Position test', position)

      const result = error.toString()
      expect(result).toContain('ParseError: Position test')
      expect(result).toContain('line 1, column 5')
    })
  })
})