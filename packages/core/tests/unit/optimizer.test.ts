import { describe, it, expect, beforeEach } from 'vitest'
import { MinoteOptimizer } from '../../src/converter/optimizer'
import type { MinoteObject, MinoteArray, MinoteTable } from '../../src/types/ast'

describe('MinoteOptimizer', () => {
  let optimizer: MinoteOptimizer

  beforeEach(() => {
    optimizer = new MinoteOptimizer()
  })

  describe('optimize', () => {
    it('should return primitive values unchanged', () => {
      expect(optimizer.optimize('string')).toBe('string')
      expect(optimizer.optimize(42)).toBe(42)
      expect(optimizer.optimize(true)).toBe(true)
      expect(optimizer.optimize(null)).toBe(null)
    })

    it('should optimize nested objects', () => {
      const obj: MinoteObject = {
        type: 'Object',
        properties: [
          {
            type: 'Property',
            key: 'name',
            value: 'Alice',
          },
          {
            type: 'Property',
            key: 'age',
            value: 30,
          },
        ],
      }

      const result = optimizer.optimize(obj)
      expect(result).toEqual(obj)
    })

    it('should convert arrays to tables when beneficial', () => {
      const arr: MinoteArray = {
        type: 'Array',
        elements: [
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 1 },
              { type: 'Property', key: 'name', value: 'Alice' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 2 },
              { type: 'Property', key: 'name', value: 'Bob' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 3 },
              { type: 'Property', key: 'name', value: 'Charlie' },
            ],
          },
        ],
      }

      const result = optimizer.optimize(arr, 3)
      expect(result.type).toBe('Table')

      const table = result as MinoteTable
      expect(table.schema.name).toBe('Row')
      expect(table.schema.fields).toHaveLength(2)
      expect(table.rows).toHaveLength(3)
    })

    it('should keep arrays as arrays when not beneficial for tables', () => {
      const arr: MinoteArray = {
        type: 'Array',
        elements: [
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 1 },
              { type: 'Property', key: 'name', value: 'Alice' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 2 },
              { type: 'Property', key: 'age', value: 25 }, // Different structure
            ],
          },
        ],
      }

      const result = optimizer.optimize(arr, 3)
      expect(result.type).toBe('Array')

      const array = result as MinoteArray
      expect(array.elements).toHaveLength(2)
    })

    it('should keep small arrays as arrays', () => {
      const arr: MinoteArray = {
        type: 'Array',
        elements: [
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 1 },
              { type: 'Property', key: 'name', value: 'Alice' },
            ],
          },
        ],
      }

      const result = optimizer.optimize(arr, 3)
      expect(result.type).toBe('Array')
    })

    it('should handle arrays with mixed element types', () => {
      const arr: MinoteArray = {
        type: 'Array',
        elements: [
          'string',
          42,
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'key', value: 'value' },
            ],
          },
        ],
      }

      const result = optimizer.optimize(arr, 3)
      expect(result.type).toBe('Array')
      expect((result as MinoteArray).elements).toHaveLength(3)
    })

    it('should preserve table type unchanged', () => {
      const table: MinoteTable = {
        type: 'Table',
        schema: {
          type: 'Schema',
          name: 'Test',
          fields: [
            { name: 'id', type: { kind: 'primitive', type: 'i' } },
            { name: 'name', type: { kind: 'primitive', type: 's' } },
          ],
        },
        rows: [
          {
            type: 'TableRow',
            cells: [1, 'Alice'],
          },
        ],
      }

      const result = optimizer.optimize(table)
      expect(result).toEqual(table)
    })

    it('should handle deeply nested structures', () => {
      const obj: MinoteObject = {
        type: 'Object',
        properties: [
          {
            type: 'Property',
            key: 'users',
            value: {
              type: 'Array',
              elements: [
                {
                  type: 'Object',
                  properties: [
                    { type: 'Property', key: 'id', value: 1 },
                    { type: 'Property', key: 'profile', value: {
                      type: 'Object',
                      properties: [
                        { type: 'Property', key: 'name', value: 'Alice' },
                      ],
                    }},
                  ],
                },
                {
                  type: 'Object',
                  properties: [
                    { type: 'Property', key: 'id', value: 2 },
                    { type: 'Property', key: 'profile', value: {
                      type: 'Object',
                      properties: [
                        { type: 'Property', key: 'name', value: 'Bob' },
                      ],
                    }},
                  ],
                },
                {
                  type: 'Object',
                  properties: [
                    { type: 'Property', key: 'id', value: 3 },
                    { type: 'Property', key: 'profile', value: {
                      type: 'Object',
                      properties: [
                        { type: 'Property', key: 'name', value: 'Charlie' },
                      ],
                    }},
                  ],
                },
              ],
            } as MinoteArray,
          },
        ],
      }

      const result = optimizer.optimize(obj, 3)
      expect(result.type).toBe('Object')

      const usersProp = (result as MinoteObject).properties[0]
      expect(usersProp.key).toBe('users')
      // Array should be converted to table since it has 3+ uniform objects
      expect((usersProp.value as any).type).toBe('Table')
    })
  })

  describe('getStats', () => {
    it('should return optimization statistics', () => {
      const arr: MinoteArray = {
        type: 'Array',
        elements: [
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 1 },
              { type: 'Property', key: 'name', value: 'Alice' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 2 },
              { type: 'Property', key: 'name', value: 'Bob' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 3 },
              { type: 'Property', key: 'name', value: 'Charlie' },
            ],
          },
        ],
      }

      optimizer.optimize(arr, 3)
      const stats = optimizer.getStats()

      expect(stats.tablesDetected).toBe(1)
      expect(stats.arraysOptimized).toBe(0)
      expect(stats.objectsInlined).toBe(0)
    })

    it('should reset stats for each optimization', () => {
      const arr: MinoteArray = {
        type: 'Array',
        elements: [
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 1 },
              { type: 'Property', key: 'name', value: 'Alice' },
            ],
          },
        ],
      }

      // First optimization
      optimizer.optimize(arr, 3)
      let stats = optimizer.getStats()
      expect(stats.tablesDetected).toBe(0)

      // Second optimization with different data
      const largerArr: MinoteArray = {
        type: 'Array',
        elements: [
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 1 },
              { type: 'Property', key: 'name', value: 'Alice' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 2 },
              { type: 'Property', key: 'name', value: 'Bob' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 3 },
              { type: 'Property', key: 'name', value: 'Charlie' },
            ],
          },
        ],
      }

      optimizer.optimize(largerArr, 3)
      stats = optimizer.getStats()
      expect(stats.tablesDetected).toBe(1)
    })

    it('should return a copy of stats (not reference)', () => {
      const stats = optimizer.getStats()
      stats.tablesDetected = 999

      const newStats = optimizer.getStats()
      expect(newStats.tablesDetected).toBe(0)
    })
  })

  describe('custom minTableRows', () => {
    it('should respect custom minTableRows threshold', () => {
      const arr: MinoteArray = {
        type: 'Array',
        elements: [
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 1 },
              { type: 'Property', key: 'name', value: 'Alice' },
            ],
          },
          {
            type: 'Object',
            properties: [
              { type: 'Property', key: 'id', value: 2 },
              { type: 'Property', key: 'name', value: 'Bob' },
            ],
          },
        ],
      }

      // With threshold 2, should convert to table
      const result1 = optimizer.optimize(arr, 2)
      expect(result1.type).toBe('Table')

      // With threshold 3, should keep as array
      const result2 = optimizer.optimize(arr, 3)
      expect(result2.type).toBe('Array')
    })

    it('should handle unknown object types with fallback', () => {
      // Create an object that looks like a MinoteValue but has an unknown type
      const unknownTypeValue = {
        type: 'UnknownType',
        someProperty: 'someValue'
      } as any

      // Should return the value unchanged due to fallback
      const result = optimizer.optimize(unknownTypeValue)
      expect(result).toEqual(unknownTypeValue)
    })
  })
})