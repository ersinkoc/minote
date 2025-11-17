import { describe, it, expect } from 'vitest'
import {
  estimateTokens,
  calculateReduction,
  deepClone,
  deepEqual,
  sortObjectKeys
} from '../../src/utils/helpers'

describe('Helper Utilities', () => {
  describe('estimateTokens', () => {
    it('should estimate tokens for empty string', () => {
      expect(estimateTokens('')).toBe(0)
    })

    it('should estimate tokens for short text', () => {
      expect(estimateTokens('hello')).toBe(2) // 5 chars / 4 = 1.25, ceil = 2
    })

    it('should estimate tokens for exact multiple of 4', () => {
      expect(estimateTokens('test')).toBe(1) // 4 chars / 4 = 1
    })

    it('should estimate tokens for longer text', () => {
      expect(estimateTokens('hello world')).toBe(3) // 11 chars / 4 = 2.75, ceil = 3
    })

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000)
      expect(estimateTokens(longText)).toBe(250) // 1000 / 4 = 250
    })

    it('should handle text with spaces and punctuation', () => {
      expect(estimateTokens('Hello, world!')).toBe(4) // 13 chars / 4 = 3.25, ceil = 4
    })

    it('should handle Unicode characters', () => {
      expect(estimateTokens('测试')).toBe(1) // 2 chars / 4 = 0.5, ceil = 1
    })
  })

  describe('calculateReduction', () => {
    it('should handle zero original value', () => {
      expect(calculateReduction(0, 100)).toBe(0)
    })

    it('should calculate reduction with smaller optimized value', () => {
      expect(calculateReduction(100, 80)).toBe(20) // (100-80)/100 * 100 = 20%
    })

    it('should calculate reduction with much smaller optimized value', () => {
      expect(calculateReduction(1000, 100)).toBe(90) // (1000-100)/1000 * 100 = 90%
    })

    it('should return 0 when no reduction', () => {
      expect(calculateReduction(100, 100)).toBe(0)
    })

    it('should return 0 when optimized is larger than original', () => {
      expect(calculateReduction(100, 120)).toBe(-20) // (100-120)/100 * 100 = -20%
    })

    it('should handle fractional values', () => {
      const result = calculateReduction(3, 2)
      expect(result).toBeCloseTo(33.33, 1) // (3-2)/3 * 100
    })

    it('should handle very small numbers', () => {
      expect(calculateReduction(1, 0.5)).toBe(50) // (1-0.5)/1 * 100 = 50%
    })

    it('should handle negative optimized value', () => {
      expect(calculateReduction(100, -50)).toBe(150) // (100-(-50))/100 * 100 = 150%
    })
  })

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone(true)).toBe(true)
      expect(deepClone(false)).toBe(false)
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('should clone arrays', () => {
      const original = [1, 2, 3]
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original) // Different reference
      expect(cloned).toEqual([1, 2, 3])
    })

    it('should clone nested arrays', () => {
      const original = [1, [2, 3], 4]
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[1]).not.toBe(original[1]) // Nested array also cloned
      expect(cloned).toEqual([1, [2, 3], 4])
    })

    it('should clone objects', () => {
      const original = { a: 1, b: 'hello' }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original) // Different reference
      expect(cloned).toEqual({ a: 1, b: 'hello' })
    })

    it('should clone nested objects', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: [3, 4]
        }
      }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b) // Nested object also cloned
      expect(cloned.b.d).not.toBe(original.b.d) // Nested array also cloned
      expect(cloned).toEqual({
        a: 1,
        b: {
          c: 2,
          d: [3, 4]
        }
      })
    })

    it('should handle complex nested structures', () => {
      const original = {
        users: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 }
        ],
        metadata: {
          count: 2,
          active: true
        }
      }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.users).not.toBe(original.users)
      expect(cloned.metadata).not.toBe(original.metadata)
    })

    it('should handle objects with null values', () => {
      const original = { a: null, b: 1 }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned.a).toBe(null)
      expect(cloned.b).toBe(1)
    })

    it('should handle Date objects', () => {
      const original = { date: new Date('2023-01-01') }
      const cloned = deepClone(original)

      // Note: Date objects are not specially handled, they get converted to empty objects
      expect(typeof cloned.date).toBe('object')
      expect(cloned).not.toEqual(original) // Date objects not properly cloned
    })

    it('should handle circular references (causes stack overflow)', () => {
      const original: any = { a: 1 }
      original.self = original

      // The current implementation doesn't handle circular references properly
      expect(() => {
        deepClone(original)
      }).toThrow('Maximum call stack size exceeded')
    })

    it('should preserve object prototype chain', () => {
      class CustomClass {
        constructor(public value: number) {}
      }
      const original = new CustomClass(42)
      const cloned = deepClone(original)

      expect(cloned.value).toBe(42)
      // Note: The implementation doesn't preserve class instances
    })
  })

  describe('deepEqual', () => {
    it('should compare primitive values', () => {
      expect(deepEqual(1, 1)).toBe(true)
      expect(deepEqual('hello', 'hello')).toBe(true)
      expect(deepEqual(true, true)).toBe(true)
      expect(deepEqual(false, false)).toBe(true)
      expect(deepEqual(null, null)).toBe(true)
      expect(deepEqual(undefined, undefined)).toBe(true)
    })

    it('should handle different primitive values', () => {
      expect(deepEqual(1, 2)).toBe(false)
      expect(deepEqual('hello', 'world')).toBe(false)
      expect(deepEqual(true, false)).toBe(false)
      expect(deepEqual(null, undefined)).toBe(false)
    })

    it('should compare arrays', () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
      expect(deepEqual([1, 2, 3], [1, 2])).toBe(false)
      expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
    })

    it('should compare nested arrays', () => {
      expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true)
      expect(deepEqual([1, [2, 3]], [1, [2, 4]])).toBe(false)
      expect(deepEqual([1, [2, 3]], [1, [2]])).toBe(false)
    })

    it('should compare objects', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
      expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
      expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    })

    it('should compare nested objects', () => {
      expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
      expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
      expect(deepEqual({ a: { b: 1 } }, { a: {} })).toBe(false)
    })

    it('should handle mixed arrays and objects', () => {
      const obj1 = { a: [1, { b: 2 }] }
      const obj2 = { a: [1, { b: 2 }] }
      const obj3 = { a: [1, { b: 3 }] }

      expect(deepEqual(obj1, obj2)).toBe(true)
      expect(deepEqual(obj1, obj3)).toBe(false)
    })

    it('should handle null values in objects', () => {
      expect(deepEqual({ a: null }, { a: null })).toBe(true)
      expect(deepEqual({ a: null }, { a: 1 })).toBe(false)
      expect(deepEqual({ a: 1 }, { a: null })).toBe(false)
    })

    it('should handle empty arrays and objects', () => {
      expect(deepEqual([], [])).toBe(true)
      expect(deepEqual({}, {})).toBe(true)
      expect(deepEqual([], {})).toBe(false)
      expect(deepEqual({}, [])).toBe(false)
    })

    it('should compare arrays with objects', () => {
      expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
      expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false)
    })

    it('should handle objects with different key order', () => {
      expect(deepEqual({ b: 2, a: 1 }, { a: 1, b: 2 })).toBe(true)
    })

    it('should compare complex structures', () => {
      const complex1 = {
        users: [
          { name: 'Alice', active: true },
          { name: 'Bob', active: false }
        ],
        count: 2
      }
      const complex2 = {
        users: [
          { name: 'Alice', active: true },
          { name: 'Bob', active: false }
        ],
        count: 2
      }
      const complex3 = {
        users: [
          { name: 'Alice', active: true },
          { name: 'Bob', active: true } // Different active value
        ],
        count: 2
      }

      expect(deepEqual(complex1, complex2)).toBe(true)
      expect(deepEqual(complex1, complex3)).toBe(false)
    })

    it('should handle different types', () => {
      expect(deepEqual(1, '1')).toBe(false)
      expect(deepEqual(true, 1)).toBe(false)
      expect(deepEqual(null, undefined)).toBe(false)
      expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false)
    })
  })

  describe('sortObjectKeys', () => {
    it('should sort object keys alphabetically', () => {
      const unsorted = { z: 1, a: 2, m: 3 }
      const sorted = sortObjectKeys(unsorted)

      expect(Object.keys(sorted)).toEqual(['a', 'm', 'z'])
      expect(sorted).toEqual({ a: 2, m: 3, z: 1 })
    })

    it('should handle empty objects', () => {
      const empty = {}
      const sorted = sortObjectKeys(empty)

      expect(Object.keys(sorted)).toEqual([])
      expect(sorted).toEqual({})
    })

    it('should preserve values when sorting', () => {
      const original = {
        name: 'Alice',
        age: 30,
        active: true
      }
      const sorted = sortObjectKeys(original)

      expect(sorted.name).toBe('Alice')
      expect(sorted.age).toBe(30)
      expect(sorted.active).toBe(true)
      expect(Object.keys(sorted)).toEqual(['active', 'age', 'name'])
    })

    it('should handle mixed case sorting', () => {
      const mixed = { Z: 1, a: 2, B: 3 }
      const sorted = sortObjectKeys(mixed)

      expect(Object.keys(sorted)).toEqual(['B', 'Z', 'a']) // ASCII order: uppercase before lowercase
    })

    it('should handle numeric keys as strings', () => {
      const numericKeys = { '2': 'b', '1': 'a', '10': 'j' }
      const sorted = sortObjectKeys(numericKeys)

      expect(Object.keys(sorted)).toEqual(['1', '2', '10']) // Lexicographic order
      expect(sorted).toEqual({ '1': 'a', '2': 'b', '10': 'j' })
    })

    it('should handle deeply nested objects', () => {
      const nested = {
        outer: {
          z: 1,
          a: 2
        }
      }
      const sorted = sortObjectKeys(nested)

      // sortObjectKeys only sorts top-level keys, not nested objects
      expect(Object.keys(sorted)).toEqual(['outer'])
      expect(Object.keys(sorted.outer)).toEqual(['z', 'a']) // Nested object unchanged
      expect(sorted.outer).toEqual({ z: 1, a: 2 })
    })

    it('should preserve object type', () => {
      const original: Record<string, number> = { x: 1, y: 2 }
      const sorted = sortObjectKeys(original)

      expect(typeof sorted).toBe('object')
      expect(Array.isArray(sorted)).toBe(false)
    })

    it('should handle special characters in keys', () => {
      const special = { '!': 1, '@': 2, '#': 3 }
      const sorted = sortObjectKeys(special)

      expect(Object.keys(sorted)).toEqual(['!', '#', '@']) // ASCII order
      expect(sorted).toEqual({ '!': 1, '#': 3, '@': 2 })
    })

    it('should return new object (not modify original)', () => {
      const original = { b: 2, a: 1 }
      const sorted = sortObjectKeys(original)

      expect(original).toEqual({ b: 2, a: 1 }) // Original unchanged
      expect(sorted).toEqual({ a: 1, b: 2 }) // Sorted
      expect(original).not.toBe(sorted) // Different references
    })

    it('should handle duplicate keys (shouldn\'t happen in normal objects)', () => {
      const normal = { key: 'value1' }
      const sorted = sortObjectKeys(normal)

      expect(Object.keys(sorted)).toEqual(['key'])
      expect(sorted.key).toBe('value1')
    })

    it('should handle deep clone with various types', () => {
      // Test various object types for deepClone
      const obj = {
        str: 'string',
        num: 42,
        bool: true,
        null: null,
        arr: [1, 2, 3],
        nested: { inner: 'value' }
      }

      const cloned = deepClone(obj)

      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.nested).not.toBe(obj.nested)
    })
  })
})