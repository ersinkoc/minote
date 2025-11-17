import { describe, it, expect } from 'vitest'
import { parse, stringify, toMinote, toJson, format } from '../../src/convenience'
import type { ParserOptions, SerializerOptions, JsonConversionOptions } from '../../src/types/options'

describe('Convenience Functions', () => {
  describe('parse function', () => {
    it('should parse simple MINOTE string', () => {
      const input = 'name: Alice'
      const result = parse(input)
      expect(result).toBeDefined()
      expect(result.body).toBeDefined()
      expect(typeof result.body).toBe('object')
    })

    it('should parse empty string', () => {
      const result = parse('')
      expect(result).toBeDefined()
      expect(result.body).toBeDefined()
    })

    it('should parse with options', () => {
      const options: ParserOptions = {
        mode: 'strict'
      }
      const result = parse('test: value', options)
      expect(result).toBeDefined()
    })
  })

  describe('stringify function', () => {
    it('should stringify simple value', () => {
      const value = 'test'
      const result = stringify(value)
      expect(typeof result).toBe('string')
    })

    it('should stringify number', () => {
      const value = 42
      const result = stringify(value)
      expect(typeof result).toBe('string')
      expect(result).toContain('42')
    })

    it('should stringify boolean', () => {
      const value = true
      const result = stringify(value)
      expect(typeof result).toBe('string')
      expect(result).toContain('true')
    })

    it('should stringify null', () => {
      const value = null
      const result = stringify(value)
      expect(typeof result).toBe('string')
      expect(result).toContain('null')
    })

    it('should stringify with options', () => {
      const options: SerializerOptions = {
        indent: 4,
        sortKeys: true
      }
      const value = 'test'
      const result = stringify(value, options)
      expect(typeof result).toBe('string')
    })
  })

  describe('toMinote function', () => {
    it('should convert JSON string to MINOTE', () => {
      const jsonString = '{"name": "Alice", "age": 30}'
      const result = toMinote(jsonString)
      expect(typeof result).toBe('string')
      expect(result).toContain('name')
      expect(result).toContain('Alice')
    })

    it('should convert JSON object to MINOTE', () => {
      const jsonObject = {
        name: 'Bob',
        age: 25
      }
      const result = toMinote(jsonObject)
      expect(typeof result).toBe('string')
      expect(result).toContain('name')
      expect(result).toContain('Bob')
    })

    it('should convert empty JSON object to MINOTE', () => {
      const result = toMinote({})
      expect(typeof result).toBe('string')
    })

    it('should convert null JSON to MINOTE', () => {
      const result = toMinote(null)
      expect(typeof result).toBe('string')
    })

    it('should convert JSON array to MINOTE', () => {
      const jsonArray = ['item1', 'item2', 'item3']
      const result = toMinote(jsonArray)
      expect(typeof result).toBe('string')
      expect(result).toContain('item1')
      expect(result).toContain('item2')
      expect(result).toContain('item3')
    })

    it('should convert nested JSON to MINOTE', () => {
      const nestedJson = {
        user: {
          name: 'Charlie',
          details: {
            age: 35,
            active: true
          }
        }
      }
      const result = toMinote(nestedJson)
      expect(typeof result).toBe('string')
      expect(result).toContain('user')
      expect(result).toContain('Charlie')
    })

    it('should convert JSON with options', () => {
      const options: JsonConversionOptions = {
        indent: 4,
        useTables: true
      }
      const jsonString = '{"data": "test"}'
      const result = toMinote(jsonString, options)
      expect(typeof result).toBe('string')
    })

    it('should handle invalid JSON string gracefully', () => {
      const invalidJson = '{invalid json}'
      expect(() => {
        toMinote(invalidJson)
      }).toThrow()
    })
  })

  describe('toJson function', () => {
    it('should convert MINOTE to pretty JSON', () => {
      const minoteInput = 'name: Alice\nage: 30'
      const result = toJson(minoteInput)
      expect(typeof result).toBe('string')
      expect(result).toContain('name')
      expect(result).toContain('Alice')
      expect(result).toContain('age')
      expect(result).toContain('30')
    })

    it('should convert MINOTE to compact JSON', () => {
      const minoteInput = 'name: Bob'
      const result = toJson(minoteInput, false)
      expect(typeof result).toBe('string')
      expect(result).toContain('name')
      expect(result).toContain('Bob')
    })

    it('should convert simple MINOTE to JSON', () => {
      const minoteInput = 'test: value'
      const result = toJson(minoteInput)
      expect(typeof result).toBe('string')
      expect(result).toContain('test')
      expect(result).toContain('value')
    })

    it('should convert empty MINOTE to JSON', () => {
      const result = toJson('')
      expect(typeof result).toBe('string')
    })

    it('should convert MINOTE with arrays to JSON', () => {
      const minoteInput = 'items: [item1 item2 item3]'
      const result = toJson(minoteInput)
      expect(typeof result).toBe('string')
    })

    it('should default to pretty JSON', () => {
      const minoteInput = 'name: Alice'
      const result = toJson(minoteInput) // No pretty parameter
      expect(typeof result).toBe('string')
      expect(result).toContain('\n') // Should be formatted with newlines
    })
  })

  describe('format function', () => {
    it('should format simple MINOTE', () => {
      const minoteInput = 'name: Alice'
      const result = format(minoteInput)
      expect(typeof result).toBe('string')
      expect(result).toContain('name')
      expect(result).toContain('Alice')
    })

    it('should format multiline MINOTE', () => {
      const minoteInput = `name: Bob
age: 25
active: true`
      const result = format(minoteInput)
      expect(typeof result).toBe('string')
      expect(result).toContain('name')
      expect(result).toContain('Bob')
      expect(result).toContain('age')
      expect(result).toContain('25')
      expect(result).toContain('active')
      expect(result).toContain('true')
    })

    it('should format with options', () => {
      const options: SerializerOptions = {
        indent: 4,
        sortKeys: true,
        trailingNewline: false
      }
      const minoteInput = 'name: Charlie\nage: 35'
      const result = format(minoteInput, options)
      expect(typeof result).toBe('string')
      expect(result).toContain('name')
      expect(result).toContain('Charlie')
      expect(result).toContain('age')
      expect(result).toContain('35')
    })

    it('should format empty string', () => {
      const result = format('')
      expect(typeof result).toBe('string')
    })

    it('should format MINOTE with nested objects', () => {
      const minoteInput = `user:
  name: David
  details:
    age: 40
    active: true`
      const result = format(minoteInput)
      expect(typeof result).toBe('string')
      expect(result).toContain('user')
      expect(result).toContain('David')
    })

    it('should format MINOTE with arrays', () => {
      const minoteInput = 'items: [item1 item2 item3]'
      const result = format(minoteInput)
      expect(typeof result).toBe('string')
    })
  })

  describe('function integration', () => {
    it('should work together: parse -> stringify', () => {
      const input = 'name: Alice'
      const parsed = parse(input)
      const stringified = stringify(parsed.body)
      expect(typeof stringified).toBe('string')
    })

    it('should work together: JSON -> MINOTE -> JSON', () => {
      const originalJson = '{"name": "Bob", "age": 25}'
      const minote = toMinote(originalJson)
      const backToJson = toJson(minote)
      expect(typeof backToJson).toBe('string')
      expect(backToJson).toContain('Bob')
      expect(backToJson).toContain('25')
    })

    it('should work together: MINOTE -> format -> parse', () => {
      const input = 'name: Charlie\nage:30'
      const formatted = format(input)
      const parsed = parse(formatted)
      expect(parsed).toBeDefined()
      expect(parsed.body).toBeDefined()
    })

    it('should handle complex roundtrip conversions', () => {
      const complexJson = {
        users: [
          { name: 'Alice', age: 30, active: true },
          { name: 'Bob', age: 25, active: false }
        ],
        metadata: {
          version: '1.0',
          created: '2023-01-01'
        }
      }

      const minote = toMinote(complexJson)
      const formatted = format(minote)
      const backToJson = toJson(formatted)

      expect(typeof minote).toBe('string')
      expect(typeof formatted).toBe('string')
      expect(typeof backToJson).toBe('string')
      expect(backToJson).toContain('Alice')
      expect(backToJson).toContain('Bob')
    })
  })

  describe('error handling', () => {
    it('should handle parse errors gracefully', () => {
      const invalidInput = '{invalid minote syntax}'
      expect(() => {
        parse(invalidInput)
      }).toThrow()
    })

    it('should handle toJson errors gracefully', () => {
      const invalidMinote = '{invalid}'
      expect(() => {
        toJson(invalidMinote)
      }).toThrow()
    })

    it('should handle format errors gracefully', () => {
      const invalidInput = '{invalid}'
      expect(() => {
        format(invalidInput)
      }).toThrow()
    })
  })
})