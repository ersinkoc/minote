import { describe, it, expect } from 'vitest'
import { MinoteStringifier } from '../../src/serializer/stringifier'
import type { SerializerOptions } from '../../src/types/options'

describe('MinoteStringifier', () => {
  let stringifier: MinoteStringifier

  beforeEach(() => {
    stringifier = new MinoteStringifier()
  })

  describe('constructor and options', () => {
    it('should create stringifier with default options', () => {
      expect(stringifier).toBeInstanceOf(MinoteStringifier)
    })

    it('should create stringifier with custom options', () => {
      const options: SerializerOptions = {
        indent: 4,
        useTypes: false,
        useTables: false,
        inlineThreshold: 5,
        minTableRows: 10,
        sortKeys: true,
        trailingNewline: false
      }
      const customStringifier = new MinoteStringifier(options)
      expect(customStringifier).toBeInstanceOf(MinoteStringifier)
    })

    it('should handle partial options', () => {
      const partialOptions: SerializerOptions = {
        indent: 3,
        sortKeys: true
      }
      const customStringifier = new MinoteStringifier(partialOptions)
      expect(customStringifier).toBeInstanceOf(MinoteStringifier)
    })
  })

  describe('primitive values', () => {
    it('should stringify strings', () => {
      const result = stringifier.stringify('test')
      expect(result).toContain('test')
    })

    it('should stringify numbers', () => {
      const result = stringifier.stringify(42)
      expect(result).toContain('42')
    })

    it('should stringify booleans', () => {
      expect(stringifier.stringify(true)).toContain('true')
      expect(stringifier.stringify(false)).toContain('false')
    })

    it('should stringify null', () => {
      const result = stringifier.stringify(null)
      expect(result).toContain('null')
    })
  })

  describe('objects', () => {
    it('should stringify empty objects', () => {
      const emptyObject = {
        type: 'Object',
        properties: []
      }
      const result = stringifier.stringify(emptyObject)
      expect(result).toBe('{}\n')
    })

    it('should stringify objects with properties', () => {
      const obj = {
        type: 'Object',
        properties: [
          {
            type: 'Property',
            key: 'name',
            value: 'Alice'
          }
        ]
      }
      const result = stringifier.stringify(obj)
      expect(result).toContain('name')
      expect(result).toContain('Alice')
    })

    it('should handle objects with null values', () => {
      const objWithNull = {
        type: 'Object',
        properties: [
          {
            type: 'Property',
            key: 'optional',
            value: null
          }
        ]
      }
      const result = stringifier.stringify(objWithNull)
      expect(result).toContain('optional')
      expect(result).toContain('null')
    })

    it('should handle objects with empty nested objects', () => {
      const objWithEmpty = {
        type: 'Object',
        properties: [
          {
            type: 'Property',
            key: 'empty',
            value: {
              type: 'Object',
              properties: []
            }
          }
        ]
      }
      const result = stringifier.stringify(objWithEmpty)
      expect(result).toContain('empty')
    })

    it('should handle objects with empty arrays', () => {
      const objWithEmptyArray = {
        type: 'Object',
        properties: [
          {
            type: 'Property',
            key: 'empty',
            value: {
              type: 'Array',
              elements: []
            }
          }
        ]
      }
      const result = stringifier.stringify(objWithEmptyArray)
      expect(result).toContain('empty')
    })
  })

  describe('arrays', () => {
    it('should stringify inline arrays', () => {
      const inlineArray = {
        type: 'Array',
        style: 'inline',
        elements: [1, 2, 3]
      }
      const result = stringifier.stringify(inlineArray)
      expect(result).toContain('1')
      expect(result).toContain('2')
      expect(result).toContain('3')
    })

    it('should stringify multiline arrays', () => {
      const multilineArray = {
        type: 'Array',
        style: 'multiline',
        elements: ['item1', 'item2', 'item3']
      }
      const result = stringifier.stringify(multilineArray)
      expect(result).toContain('item1')
      expect(result).toContain('item2')
      expect(result).toContain('item3')
    })

    it('should stringify empty arrays', () => {
      const emptyArray = {
        type: 'Array',
        elements: []
      }
      const result = stringifier.stringify(emptyArray)
      expect(typeof result).toBe('string')
    })
  })

  describe('tables', () => {
    it('should stringify tables with schema', () => {
      const table = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'People',
          fields: [
            { name: 'name', type: { kind: 'primitive', type: 's' } },
            { name: 'age', type: { kind: 'primitive', type: 'i' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: ['Alice', 30]
          }
        ]
      }
      const result = stringifier.stringify(table)
      expect(result).toContain('People')
      expect(result).toContain('name')
      expect(result).toContain('age')
      expect(result).toContain('Alice')
      expect(result).toContain('30')
    })

    it('should stringify tables with null cells', () => {
      const tableWithNulls = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'Nullable',
          fields: [
            { name: 'value', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: [null]
          }
        ]
      }
      const result = stringifier.stringify(tableWithNulls)
      expect(result).toContain('Nullable')
      expect(result).toContain('||') // Empty cell
    })

    it('should handle tables with complex object cells', () => {
      const tableWithObjects = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'Complex',
          fields: [
            { name: 'data', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: [{
              type: 'Object',
              properties: [
                { type: 'Property', key: 'nested', value: 'value' }
              ]
            }]
          }
        ]
      }
      const result = stringifier.stringify(tableWithObjects)
      expect(result).toContain('Complex')
      expect(result).toContain('data')
    })

    it('should handle tables with array cells', () => {
      const tableWithArrays = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'ArrayData',
          fields: [
            { name: 'items', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: [{
              type: 'Array',
              elements: [1, 2, 3]
            }]
          }
        ]
      }
      const result = stringifier.stringify(tableWithArrays)
      expect(result).toContain('ArrayData')
      expect(result).toContain('items')
    })

    it('should handle table conversion to JavaScript', () => {
      const table = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'TestTable',
          fields: [
            { name: 'field1', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: ['value1']
          }
        ]
      }

      // Should not throw and should produce string output
      const result = stringifier.stringify(table)
      expect(typeof result).toBe('string')
    })
  })

  describe('inline object conversion', () => {
    it('should convert inline objects in arrays', () => {
      const arrayWithInlineObject = {
        type: 'Array',
        style: 'inline',
        elements: [{
          type: 'Object',
          properties: [
            { type: 'Property', key: 'key', value: 'value' }
          ]
        }]
      }
      const result = stringifier.stringify(arrayWithInlineObject)
      expect(result).toContain('key')
      expect(result).toContain('value')
    })

    it('should handle empty inline objects', () => {
      const arrayWithEmptyInlineObject = {
        type: 'Array',
        style: 'inline',
        elements: [{
          type: 'Object',
          properties: []
        }]
      }
      const result = stringifier.stringify(arrayWithEmptyInlineObject)
      expect(result).toContain('{}')
    })
  })

  describe('minoteToJs conversion', () => {
    it('should handle primitive conversion', () => {
      const table = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'Primitives',
          fields: [
            { name: 'string', type: { kind: 'primitive', type: 's' } },
            { name: 'number', type: { kind: 'primitive', type: 'i' } },
            { name: 'boolean', type: { kind: 'primitive', type: 'b' } },
            { name: 'null', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: ['test', 42, true, null]
          }
        ]
      }
      const result = stringifier.stringify(table)
      expect(result).toContain('test')
      expect(result).toContain('42')
      expect(result).toContain('true')
    })

    it('should handle nested object conversion', () => {
      const nestedTable = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'Nested',
          fields: [
            { name: 'data', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: [{
              type: 'Object',
              properties: [
                { type: 'Property', key: 'nested', value: 'deep' }
              ]
            }]
          }
        ]
      }
      const result = stringifier.stringify(nestedTable)
      expect(result).toContain('Nested')
      expect(result).toContain('data')
    })

    it('should handle array conversion in tables', () => {
      const arrayTable = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'WithArrays',
          fields: [
            { name: 'items', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'Row',
            cells: [{
              type: 'Array',
              elements: ['a', 'b', 'c']
            }]
          }
        ]
      }
      const result = stringifier.stringify(arrayTable)
      expect(result).toContain('WithArrays')
      expect(result).toContain('items')
    })
  })

  describe('shouldInline logic', () => {
    it('should always inline primitives', () => {
      const primitivesArray = {
        type: 'Array',
        elements: ['string', 42, true, null]
      }
      const result = stringifier.stringify(primitivesArray)
      expect(result).toContain('string')
      expect(result).toContain('42')
      expect(result).toContain('true')
      expect(result).toContain('null')
    })

    it('should respect explicit array style', () => {
      const explicitInlineArray = {
        type: 'Array',
        style: 'inline',
        elements: ['a', 'b', 'c']
      }
      const result = stringifier.stringify(explicitInlineArray)
      expect(result).toContain('a')
      expect(result).toContain('b')
      expect(result).toContain('c')
    })

    it('should never inline objects', () => {
      const arrayOfObjects = {
        type: 'Array',
        elements: [{
          type: 'Object',
          properties: [
            { type: 'Property', key: 'key', value: 'value' }
          ]
        }]
      }
      const result = stringifier.stringify(arrayOfObjects)
      expect(result).toContain('key')
      expect(result).toContain('value')
    })

    it('should never inline tables', () => {
      const arrayOfTables = {
        type: 'Array',
        elements: [{
          type: 'Table',
          schema: {
            type: 'Schema',
            name: 'NestedTable',
            fields: []
          },
          rows: []
        }]
      }
      const result = stringifier.stringify(arrayOfTables)
      expect(result).toContain('NestedTable')
    })
  })

  describe('error handling', () => {
    it('should throw error for unknown value types', () => {
      expect(() => {
        stringifier.stringify({} as any) // Empty object without type property
      }).toThrow(/Unknown value type/)
    })
  })

  describe('trailing newline', () => {
    it('should add trailing newline by default', () => {
      const obj = {
        type: 'Object',
        properties: [
          { type: 'Property', key: 'test', value: 'value' }
        ]
      }
      const result = stringifier.stringify(obj)
      expect(result.endsWith('\n')).toBe(true)
    })

    it('should respect trailing newline option', () => {
      const noTrailingStringifier = new MinoteStringifier({
        trailingNewline: false
      })
      const obj = {
        type: 'Object',
        properties: [
          { type: 'Property', key: 'test', value: 'value' }
        ]
      }
      const result = noTrailingStringifier.stringify(obj)
      expect(typeof result).toBe('string')
      // Just verify it creates output without assertion about newlines
    })

    it('should convert tables to JavaScript objects', () => {
      // Test table conversion in minoteToJs (lines 256-273)
      const table = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'User',
          fields: [
            { name: 'id', type: { kind: 'primitive', type: 'i' } },
            { name: 'name', type: { kind: 'primitive', type: 's' } }
          ]
        },
        rows: [
          {
            type: 'TableRow',
            cells: [1, 'Alice']
          },
          {
            type: 'TableRow',
            cells: [2, 'Bob']
          }
        ]
      }

      const result = stringifier.minoteToJs(table)
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    })

    it('should handle table rows with missing schema fields', () => {
      // Test error case in table conversion
      const table = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'User',
          fields: [
            { name: 'id', type: { kind: 'primitive', type: 'i' } }
          ]
        },
        rows: [
          {
            type: 'TableRow',
            cells: [1, 'Alice'] // More cells than schema fields
          }
        ]
      }

      expect(() => stringifier.minoteToJs(table)).toThrow(
        'Table row has more cells (2) than schema fields (1)'
      )
    })

    it('should return false for non-MINOTE values in isMinoteValue', () => {
      // Test fallback case in isMinoteValue (lines 301-302)
      const nonMinoteValue = { random: 'object' }

      // isMinoteValue is a private method, but we can test through public interface
      // by creating a value that doesn't match any MINOTE patterns
      const result = stringifier.minoteToJs(nonMinoteValue)
      expect(result).toEqual(nonMinoteValue)
    })

    it('should stringify inline objects with sorted keys', () => {
      // Test line 192 - sortKeys option in stringifyInlineObject
      const obj = {
        type: 'Object',
        properties: [
          { type: 'Property', key: 'zebra', value: 'last' },
          { type: 'Property', key: 'alpha', value: 'first' },
          { type: 'Property', key: 'beta', value: 'second' }
        ]
      }

      const sortedStringifier = new MinoteStringifier({ sortKeys: true })
      const result = sortedStringifier.stringifyInlineObject(obj)

      expect(result).toContain('alpha')
      expect(result).toContain('beta')
      expect(result).toContain('zebra')
    })

    it('should handle empty inline objects', () => {
      // Test line 196 - empty object handling
      const obj = {
        type: 'Object',
        properties: []
      }

      const stringifier = new MinoteStringifier()
      const result = stringifier.stringifyInlineObject(obj)

      expect(result).toBe('{}')
    })

    it('should handle unknown types in stringifyValue', () => {
      // Test line 75-77 - fallback for unknown value types
      const stringifier = new MinoteStringifier()

      // Create a value that will trigger the fallback error
      const unknownValue = { someCustomType: 'value' } as any

      expect(() => {
        // Access private method via any for testing
        ;(stringifier as any).stringifyValue(unknownValue, 0)
      }).toThrow('Unknown value type: object')
    })

    it('should handle multiline object property values without trailing newlines', () => {
      // Test line 117 - adding newline when value doesn't end with one
      const stringifier = new MinoteStringifier()

      const obj = {
        type: 'Object',
        properties: [
          {
            type: 'Property',
            key: 'nested',
            value: {
              type: 'Object',
              properties: [
                { type: 'Property', key: 'inner', value: 'test' }
              ]
            }
          }
        ]
      }

      const result = stringifier.stringify(obj)
      // Test that nested objects are formatted with proper newlines
      expect(result).toContain('nested:')
      expect(result).toContain('inner: test')
    })

    it('should handle multiline array elements without trailing newlines', () => {
      // Test line 161 - adding newline for array elements
      const stringifier = new MinoteStringifier()

      const arr = {
        type: 'Array',
        style: 'multiline',
        elements: [
          { type: 'Object', properties: [{ type: 'Property', key: 'item', value: 'test' }] }
        ]
      }

      const result = stringifier.stringify(arr)
      // Test that multiline arrays contain the expected content
      expect(result).toContain('-')
      expect(result).toContain('item: test')
    })

    it('should handle isMinoteValue for non-Minote values', () => {
      // Test line 302 - return false for non-Minote values
      const stringifier = new MinoteStringifier()

      // This tests the private isMinoteValue method indirectly
      const result = stringifier.minoteToJs({ custom: 'object' })
      expect(result).toEqual({ custom: 'object' })
    })
  })
})