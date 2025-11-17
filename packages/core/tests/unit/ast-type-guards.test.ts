import { describe, it, expect } from 'vitest'
import {
  isMinoteArray,
  isMinoteTable,
  isPrimitive,
  MinoteValue,
  MinoteArray,
  MinoteTable
} from '../../src/types/ast'

describe('AST Type Guards', () => {
  describe('isPrimitive', () => {
    it('should return true for strings', () => {
      expect(isPrimitive('hello')).toBe(true)
      expect(isPrimitive('')).toBe(true)
      expect(isPrimitive('123')).toBe(true)
    })

    it('should return true for numbers', () => {
      expect(isPrimitive(42)).toBe(true)
      expect(isPrimitive(0)).toBe(true)
      expect(isPrimitive(-10)).toBe(true)
      expect(isPrimitive(3.14)).toBe(true)
    })

    it('should return true for booleans', () => {
      expect(isPrimitive(true)).toBe(true)
      expect(isPrimitive(false)).toBe(true)
    })

    it('should return true for null', () => {
      expect(isPrimitive(null)).toBe(true)
    })

    it('should return false for objects', () => {
      expect(isPrimitive({})).toBe(false)
      expect(isPrimitive({ type: 'Object' })).toBe(false)
    })

    it('should return false for arrays', () => {
      expect(isPrimitive([])).toBe(false)
      expect(isPrimitive([1, 2, 3])).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isPrimitive(undefined)).toBe(false)
    })

    it('should return false for functions', () => {
      expect(isPrimitive(() => {})).toBe(false)
      expect(isPrimitive(function() {})).toBe(false)
    })

    it('should return false for other complex types', () => {
      expect(isPrimitive(new Date())).toBe(false)
      expect(isPrimitive(/regex/)).toBe(false)
      expect(isPrimitive(new Map())).toBe(false)
      expect(isPrimitive(new Set())).toBe(false)
    })

    it('should have correct type narrowing', () => {
      const value: MinoteValue = 'hello' as MinoteValue

      if (isPrimitive(value)) {
        // TypeScript should know value is string | number | boolean | null
        expect(typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null).toBe(true)
      }
    })
  })

  describe('isMinoteArray', () => {
    it('should return true for MinoteArray objects', () => {
      const array: MinoteArray = {
        type: 'Array',
        elements: ['a', 'b', 'c'],
        style: 'inline'
      }
      expect(isMinoteArray(array)).toBe(true)
    })

    it('should return false for other types', () => {
      expect(isMinoteArray({ type: 'Object' })).toBe(false)
      expect(isMinoteArray({ type: 'Table' })).toBe(false)
      expect(isMinoteArray({ type: 'Property' })).toBe(false)
      expect(isMinoteArray({ type: 'Schema' })).toBe(false)
      expect(isMinoteArray({ type: 'TableRow' })).toBe(false)
    })

    it('should return false for non-objects', () => {
      expect(isMinoteArray('string')).toBe(false)
      expect(isMinoteArray(123)).toBe(false)
      expect(isMinoteArray(null)).toBe(false)
      expect(isMinoteArray(undefined)).toBe(false)
    })

    it('should return false for objects without type property', () => {
      expect(isMinoteArray({})).toBe(false)
      expect(isMinoteArray({ elements: [] })).toBe(false)
    })

    it('should return false for null', () => {
      expect(isMinoteArray(null)).toBe(false)
    })
  })

  describe('isMinoteTable', () => {
    it('should return true for MinoteTable objects', () => {
      const table: MinoteTable = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'User',
          fields: []
        },
        rows: []
      }
      expect(isMinoteTable(table)).toBe(true)
    })

    it('should return false for other types', () => {
      expect(isMinoteTable({ type: 'Object' })).toBe(false)
      expect(isMinoteTable({ type: 'Array' })).toBe(false)
      expect(isMinoteTable({ type: 'Property' })).toBe(false)
      expect(isMinoteTable({ type: 'Schema' })).toBe(false)
      expect(isMinoteTable({ type: 'TableRow' })).toBe(false)
    })

    it('should return false for non-objects', () => {
      expect(isMinoteTable('string')).toBe(false)
      expect(isMinoteTable(123)).toBe(false)
      expect(isMinoteTable(null)).toBe(false)
      expect(isMinoteTable(undefined)).toBe(false)
    })

    it('should return false for objects without type property', () => {
      expect(isMinoteTable({})).toBe(false)
      expect(isMinoteTable({ schema: {} })).toBe(false)
    })

    it('should return false for null', () => {
      expect(isMinoteTable(null)).toBe(false)
    })
  })

  describe('Type Guard Integration', () => {
    it('should work together in type checking scenarios', () => {
      const values: MinoteValue[] = [
        'string',
        42,
        true,
        null,
        { type: 'Array', elements: [], style: 'inline' },
        { type: 'Table', schema: { type: 'Schema', name: 'Test', fields: [] }, rows: [] },
        { type: 'Object', properties: [] }
      ]

      const primitives = values.filter(isPrimitive)
      const arrays = values.filter(isMinoteArray)
      const tables = values.filter(isMinoteTable)

      expect(primitives).toHaveLength(4) // string, number, boolean, null
      expect(arrays).toHaveLength(1) // MinoteArray
      expect(tables).toHaveLength(1) // MinoteTable
    })

    it('should correctly narrow types in conditional blocks', () => {
      const value: MinoteValue = { type: 'Array', elements: [], style: 'inline' }

      if (isMinoteArray(value)) {
        // TypeScript knows this is MinoteArray
        expect(value.type).toBe('Array')
        expect(Array.isArray(value.elements)).toBe(true)
      } else {
        // This branch should not be reached
        expect(true).toBe(false)
      }
    })
  })
})