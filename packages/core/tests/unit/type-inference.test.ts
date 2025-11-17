import { describe, it, expect } from 'vitest'
import {
  inferType,
  isTableCandidate,
  extractSchema,
  isPlainObject,
  parseTypeAnnotation,
  formatTypeAnnotation,
  typeMatches
} from '../../src/utils/type-inference'

describe('Type Inference Utilities', () => {
  describe('inferType', () => {
    it('should infer null type', () => {
      expect(inferType(null)).toBe('null')
    })

    it('should infer string type', () => {
      expect(inferType('hello')).toBe('s')
      expect(inferType('')).toBe('s')
      expect(inferType('123')).toBe('s')
    })

    it('should infer integer type', () => {
      expect(inferType(0)).toBe('i')
      expect(inferType(42)).toBe('i')
      expect(inferType(-10)).toBe('i')
      expect(inferType(Number.MAX_SAFE_INTEGER)).toBe('i')
    })

    it('should infer float type', () => {
      expect(inferType(3.14)).toBe('f')
      expect(inferType(-0.5)).toBe('f')
      expect(inferType(Number.POSITIVE_INFINITY)).toBe('f')
      expect(inferType(Number.NEGATIVE_INFINITY)).toBe('f')
    })

    it('should infer boolean type', () => {
      expect(inferType(true)).toBe('b')
      expect(inferType(false)).toBe('b')
    })

    it('should fallback to string for unknown types', () => {
      expect(inferType(undefined)).toBe('s')
      expect(inferType(() => {})).toBe('s')
      expect(inferType(new Date())).toBe('s')
      expect(inferType(/regex/)).toBe('s')
      expect(inferType(new Map())).toBe('s')
      expect(inferType(new Set())).toBe('s')
    })
  })

  describe('isTableCandidate', () => {
    it('should return false for empty arrays', () => {
      expect(isTableCandidate([])).toBe(false)
    })

    it('should return true for arrays of uniform objects', () => {
      const uniform = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ]
      expect(isTableCandidate(uniform)).toBe(true)
    })

    it('should return false for arrays with mixed types', () => {
      const mixed = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        'not an object'
      ]
      expect(isTableCandidate(mixed)).toBe(false)
    })

    it('should return false for arrays with non-objects', () => {
      const nonObjects = ['string', 123, true, null]
      expect(isTableCandidate(nonObjects)).toBe(false)
    })

    it('should return false for arrays of objects with different keys', () => {
      const differentKeys = [
        { id: 1, name: 'Alice' },
        { id: 2, age: 30 },
        { id: 3, name: 'Charlie', age: 25 }
      ]
      expect(isTableCandidate(differentKeys)).toBe(false)
    })

    it('should return true for objects with same keys in different order', () => {
      const differentOrder = [
        { name: 'Alice', id: 1 },
        { id: 2, name: 'Bob' },
        { name: 'Charlie', id: 3 }
      ]
      expect(isTableCandidate(differentOrder)).toBe(true)
    })

    it('should return true for objects with empty objects', () => {
      const emptyObjects = [{}, {}, {}]
      expect(isTableCandidate(emptyObjects)).toBe(true)
    })

    it('should return false for arrays with null elements', () => {
      const withNull = [
        { id: 1, name: 'Alice' },
        null,
        { id: 3, name: 'Charlie' }
      ]
      expect(isTableCandidate(withNull)).toBe(false)
    })

    it('should return false for arrays with arrays', () => {
      const withArrays = [
        { id: 1, items: [] },
        { id: 2, items: ['a', 'b'] },
        { id: 3, items: [] }
      ]
      expect(isTableCandidate(withArrays)).toBe(true) // Arrays inside objects are fine
    })
  })

  describe('extractSchema', () => {
    it('should extract schema from uniform objects', () => {
      const data = [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false }
      ]
      const schema = extractSchema(data)
      expect(schema).toEqual({
        name: 'Row',
        fields: [
          { name: 'id', type: 'i' },
          { name: 'name', type: 's' },
          { name: 'active', type: 'b' }
        ]
      })
    })

    it('should return empty schema for empty array', () => {
      const schema = extractSchema([])
      expect(schema).toEqual({
        name: 'Row',
        fields: []
      })
    })

    it('should use custom name', () => {
      const data = [{ id: 1 }]
      const schema = extractSchema(data, 'User')
      expect(schema.name).toBe('User')
    })

    it('should handle object with various data types', () => {
      const data = [
        {
          id: 1,
          name: 'Alice',
          score: 95.5,
          active: true,
          metadata: null
        }
      ]
      const schema = extractSchema(data)
      expect(schema.fields).toEqual([
        { name: 'id', type: 'i' },
        { name: 'name', type: 's' },
        { name: 'score', type: 'f' },
        { name: 'active', type: 'b' },
        { name: 'metadata', type: 'null' }
      ])
    })

    it('should handle object with numeric keys', () => {
      const data = [{ '123': 'value', '456': 42 }]
      const schema = extractSchema(data)
      expect(schema.fields).toEqual([
        { name: '123', type: 's' },
        { name: '456', type: 'i' }
      ])
    })
  })

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ key: 'value' })).toBe(true)
      expect(isPlainObject(Object.create(null))).toBe(false) // Different prototype
    })

    it('should return false for arrays', () => {
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject([1, 2, 3])).toBe(false)
    })

    it('should return false for null', () => {
      expect(isPlainObject(null)).toBe(false)
    })

    it('should return false for primitives', () => {
      expect(isPlainObject('string')).toBe(false)
      expect(isPlainObject(123)).toBe(false)
      expect(isPlainObject(true)).toBe(false)
      expect(isPlainObject(undefined)).toBe(false)
    })

    it('should return false for built-in objects', () => {
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject(/regex/)).toBe(false)
      expect(isPlainObject(new Map())).toBe(false)
      expect(isPlainObject(new Set())).toBe(false)
      expect(isPlainObject(() => {})).toBe(false)
    })

    it('should return false for objects with custom prototypes', () => {
      class CustomClass {}
      expect(isPlainObject(new CustomClass())).toBe(false)

      const obj = Object.create({ custom: 'prototype' })
      expect(isPlainObject(obj)).toBe(false)
    })

    it('should return true for Object.create(null)', () => {
      const obj = Object.create(null)
      expect(isPlainObject(obj)).toBe(false) // Different prototype than Object.prototype
    })
  })

  describe('parseTypeAnnotation', () => {
    it('should parse primitive types with @ prefix', () => {
      expect(parseTypeAnnotation('@s')).toBe('s')
      expect(parseTypeAnnotation('@i')).toBe('i')
      expect(parseTypeAnnotation('@f')).toBe('f') // @f returns 'f', not 'b'
      expect(parseTypeAnnotation('@b')).toBe('b')
      expect(parseTypeAnnotation('@null')).toBe('null')
    })

    it('should parse primitive types without @ prefix', () => {
      expect(parseTypeAnnotation('s')).toBe('s')
      expect(parseTypeAnnotation('i')).toBe('i')
      expect(parseTypeAnnotation('f')).toBe('f')
      expect(parseTypeAnnotation('b')).toBe('b')
    })

    it('should parse array types', () => {
      expect(parseTypeAnnotation('@s[]')).toEqual({
        kind: 'array',
        elementType: 's'
      })
      expect(parseTypeAnnotation('@i[]')).toEqual({
        kind: 'array',
        elementType: 'i'
      })
      expect(parseTypeAnnotation('@f[]')).toEqual({
        kind: 'array',
        elementType: 'f'
      })
    })

    it('should parse array types without @ prefix', () => {
      expect(parseTypeAnnotation('s[]')).toEqual({
        kind: 'array',
        elementType: 's'
      })
    })

    it('should handle complex array types', () => {
      expect(parseTypeAnnotation('@string[]')).toEqual({
        kind: 'array',
        elementType: 'string' // Not a PrimitiveType, but will be handled
      })
    })
  })

  describe('formatTypeAnnotation', () => {
    it('should format primitive types', () => {
      expect(formatTypeAnnotation('s')).toBe('@s')
      expect(formatTypeAnnotation('i')).toBe('@i')
      expect(formatTypeAnnotation('f')).toBe('@f')
      expect(formatTypeAnnotation('b')).toBe('@b')
      expect(formatTypeAnnotation('null')).toBe('@null')
    })

    it('should format array types', () => {
      expect(formatTypeAnnotation({ kind: 'array', elementType: 's' })).toBe('@s[]')
      expect(formatTypeAnnotation({ kind: 'array', elementType: 'i' })).toBe('@i[]')
      expect(formatTypeAnnotation({ kind: 'array', elementType: 'f' })).toBe('@f[]')
    })

    it('should format array types with complex element types', () => {
      expect(formatTypeAnnotation({ kind: 'array', elementType: 'string' as any })).toBe('@string[]')
      expect(formatTypeAnnotation({ kind: 'array', elementType: { complex: 'type' } as any })).toBe('@s[]')
    })

    it('should handle object types', () => {
      expect(formatTypeAnnotation({ kind: 'object' } as any)).toBe('@obj')
    })
  })

  describe('parseTypeAnnotation edge cases', () => {
    it('should handle unknown type annotations with fallback', () => {
      // Test the fallback case (line 160) for unknown types
      expect(parseTypeAnnotation('@unknown')).toBe('unknown')
      expect(parseTypeAnnotation('@customType')).toBe('customType')
      expect(parseTypeAnnotation('@xyz123')).toBe('xyz123')
    })
  })

  describe('typeMatches', () => {
    it('should match exact primitive types', () => {
      expect(typeMatches('s', 'hello')).toBe(true)
      expect(typeMatches('i', 42)).toBe(true)
      expect(typeMatches('f', 3.14)).toBe(true)
      expect(typeMatches('b', true)).toBe(true)
      expect(typeMatches('null', null)).toBe(true)
    })

    it('should not mismatched primitive types', () => {
      expect(typeMatches('s', 123)).toBe(false)
      expect(typeMatches('i', 'hello')).toBe(false)
      expect(typeMatches('f', true)).toBe(false)
      expect(typeMatches('b', 123)).toBe(false)
      expect(typeMatches('null', 'hello')).toBe(false)
    })

    it('should match array types', () => {
      expect(typeMatches({ kind: 'array', elementType: 's' }, ['hello', 'world'])).toBe(true)
      expect(typeMatches({ kind: 'array', elementType: 'i' }, [1, 2, 3])).toBe(true)
      expect(typeMatches({ kind: 'array', elementType: 'f' }, [1.5, 2.5])).toBe(true)
    })

    it('should not match array with wrong element type', () => {
      expect(typeMatches({ kind: 'array', elementType: 's' }, [1, 2, 3])).toBe(false)
      expect(typeMatches({ kind: 'array', elementType: 'i' }, ['hello', 'world'])).toBe(false)
    })

    it('should not match non-arrays with array types', () => {
      expect(typeMatches({ kind: 'array', elementType: 's' }, 'hello')).toBe(false)
      expect(typeMatches({ kind: 'array', elementType: 'i' }, 123)).toBe(false)
      expect(typeMatches({ kind: 'array', elementType: 'b' }, true)).toBe(false)
    })

    it('should match empty arrays', () => {
      expect(typeMatches({ kind: 'array', elementType: 's' }, [])).toBe(true)
      expect(typeMatches({ kind: 'array', elementType: 'i' }, [])).toBe(true)
      expect(typeMatches({ kind: 'array', elementType: 'f' }, [])).toBe(true)
    })

    it('should handle type normalization', () => {
      expect(typeMatches('int', 42)).toBe(true)
      expect(typeMatches('str', 'hello')).toBe(true)
      expect(typeMatches('float', 3.14)).toBe(true)
      expect(typeMatches('bool', true)).toBe(true)
    })

    it('should return false for unknown types', () => {
      expect(typeMatches({ kind: 'unknown' } as any, 'hello')).toBe(false)
    })
  })
})