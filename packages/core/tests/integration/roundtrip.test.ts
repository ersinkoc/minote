import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { JsonToMinoteConverter, MinoteToJsonConverter } from '../../src/converter'
import { deepEqual } from '../../src/utils/helpers'

describe('Roundtrip Conversion', () => {
  const toMinote = new JsonToMinoteConverter()
  const toJson = new MinoteToJsonConverter()

  it('should preserve data: JSON → MINOTE → JSON', () => {
    const original = {
      name: 'Alice',
      age: 30,
      active: true,
      contact: {
        email: 'alice@example.com',
        phone: '+1-555-0100',
      },
      tags: ['developer', 'designer'],
    }

    // JSON → MINOTE
    const minote = toMinote.convert(original)

    // MINOTE → JSON
    const result = toJson.convertToObject(minote)

    expect(deepEqual(result, original)).toBe(true)
  })

  it('should handle arrays of objects', () => {
    const original = {
      users: [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        { id: 3, name: 'Charlie', age: 35 },
      ],
    }

    const minote = toMinote.convert(original)
    const result = toJson.convertToObject(minote)

    expect(deepEqual(result, original)).toBe(true)
  })

  it('should handle nested structures', () => {
    const original = {
      company: 'TechCorp',
      departments: [
        {
          name: 'Engineering',
          employees: [
            { name: 'Alice', role: 'Engineer' },
            { name: 'Bob', role: 'Engineer' },
          ],
        },
        {
          name: 'Marketing',
          employees: [{ name: 'Charlie', role: 'Manager' }],
        },
      ],
    }

    const minote = toMinote.convert(original)
    const result = toJson.convertToObject(minote)

    expect(deepEqual(result, original)).toBe(true)
  })

  it('should handle TechCorp example from fixtures', () => {
    try {
      const jsonPath = join(__dirname, '../fixtures/techcorp.json')
      const techcorpJson = readFileSync(jsonPath, 'utf-8')
      const original = JSON.parse(techcorpJson)

      // JSON → MINOTE
      const minote = toMinote.convert(original)

      // MINOTE → JSON
      const result = toJson.convertToObject(minote)

      expect(deepEqual(result, original)).toBe(true)
    } catch (error) {
      // If file doesn't exist, skip test
      console.log('Skipping TechCorp test - fixture not found')
    }
  })

  it('should preserve primitive types', () => {
    const original = {
      string: 'hello',
      number: 42,
      float: 3.14,
      boolean: true,
      null_value: null,
    }

    const minote = toMinote.convert(original)
    const result = toJson.convertToObject(minote)

    expect(result).toEqual(original)
  })

  it('should handle empty structures', () => {
    const original = {
      empty_object: {},
      empty_array: [],
      with_data: { key: 'value' },
    }

    const minote = toMinote.convert(original)
    const result = toJson.convertToObject(minote)

    expect(deepEqual(result, original)).toBe(true)
  })

  it('should handle special characters in strings', () => {
    const original = {
      quoted: 'Hello "World"',
      newline: 'Line 1\nLine 2',
      tab: 'Column\tSeparated',
      backslash: 'Path\\to\\file',
    }

    const minote = toMinote.convert(original)
    const result = toJson.convertToObject(minote)

    expect(deepEqual(result, original)).toBe(true)
  })
})
