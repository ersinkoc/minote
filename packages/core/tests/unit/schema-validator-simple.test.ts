import { describe, it, expect } from 'vitest'
import { SchemaValidator } from '../../src/validator/schema-validator'
import { ValidationIssue } from '../../src/errors'
import type { SchemaDefinition, MinoteValue } from '../../src/types/ast'

describe('SchemaValidator Simple', () => {
  let validator: SchemaValidator

  beforeEach(() => {
    validator = new SchemaValidator()
  })

  it('should create validator with default options', () => {
    expect(validator).toBeInstanceOf(SchemaValidator)
  })

  it('should create validator with custom options', () => {
    const customValidator = new SchemaValidator({
      allowExtraFields: true,
      coerceTypes: true,
      strict: true
    })
    expect(customValidator).toBeInstanceOf(SchemaValidator)
  })

  it('should validate without throwing (current implementation)', () => {
    const schema: SchemaDefinition = {
      type: 'Schema',
      name: 'TestSchema',
      fields: [
        { name: 'name', type: { kind: 'primitive', type: 's' } }
      ],
    }

    const value: MinoteValue = 'test value'

    expect(() => {
      validator.validate(value, schema)
    }).not.toThrow()
  })

  it('should handle different value types', () => {
    const schema: SchemaDefinition = {
      type: 'Schema',
      name: 'TestSchema',
      fields: [],
    }

    const values: MinoteValue[] = [
      'string',
      42,
      true,
      null,
      {
        type: 'Object',
        properties: [],
      },
      {
        type: 'Array',
        elements: [],
      },
    ]

    values.forEach(value => {
      expect(() => {
        validator.validate(value, schema)
      }).not.toThrow()
    })
  })

  it('should handle empty schema', () => {
    const emptySchema: SchemaDefinition = {
      type: 'Schema',
      name: 'Empty',
      fields: [],
    }

    expect(() => {
      validator.validate('test', emptySchema)
    }).not.toThrow()
  })

  it('should handle schema with multiple fields', () => {
    const complexSchema: SchemaDefinition = {
      type: 'Schema',
      name: 'ComplexSchema',
      fields: [
        { name: 'id', type: { kind: 'primitive', type: 'i' } },
        { name: 'name', type: { kind: 'primitive', type: 's' } },
        { name: 'active', type: { kind: 'primitive', type: 'b' } },
        { name: 'score', type: { kind: 'primitive', type: 'f' } },
      ],
    }

    expect(() => {
      validator.validate('test', complexSchema)
    }).not.toThrow()
  })

  it('should handle complex nested values', () => {
    const schema: SchemaDefinition = {
      type: 'Schema',
      name: 'NestedSchema',
      fields: [],
    }

    const complexValue: MinoteValue = {
      type: 'Object',
      properties: [
        {
          type: 'Property',
          key: 'nested',
          value: {
            type: 'Array',
            elements: ['item1', 'item2'],
          },
        },
      ],
    }

    expect(() => {
      validator.validate(complexValue, schema)
    }).not.toThrow()
  })

  it('should handle table values', () => {
    const schema: SchemaDefinition = {
      type: 'Schema',
      name: 'TableSchema',
      fields: [],
    }

    const tableValue: MinoteValue = {
      type: 'Table',
      schema: {
        type: 'Schema',
        name: 'TestTable',
        fields: [],
      },
      rows: [],
    }

    expect(() => {
      validator.validate(tableValue, schema)
    }).not.toThrow()
  })

  it('should validate multiple times without issues', () => {
    const schema: SchemaDefinition = {
      type: 'Schema',
      name: 'TestSchema',
      fields: [],
    }

    expect(() => {
      validator.validate('value1', schema)
      validator.validate('value2', schema)
      validator.validate('value3', schema)
    }).not.toThrow()
  })

  describe('validation error throwing', () => {
    it('should handle validation without errors', () => {
      // Test that the current implementation doesn't throw errors (since validation is not implemented)
      const validator = new SchemaValidator()
      const schema: SchemaDefinition = {
        type: 'Schema',
        name: 'TestSchema',
        fields: [],
      }

      expect(() => {
        validator.validate('test', schema)
      }).not.toThrow()
    })
  })

  describe('issue tracking', () => {
    it('should add issues with correct structure', () => {
      // Test the addIssue method (lines 27-29)
      class TestValidator extends SchemaValidator {
        addTestIssue(path: string[], message: string, severity: 'error' | 'warning' = 'error'): void {
          ;(this as any).addIssue(path, message, severity)
        }

        getIssues(): ValidationIssue[] {
          return (this as any).issues
        }
      }

      const testValidator = new TestValidator()

      // Test adding an error issue
      testValidator.addTestIssue(['field1'], 'Error message', 'error')
      testValidator.addTestIssue(['field2'], 'Warning message', 'warning')

      const issues = testValidator.getIssues()
      expect(issues).toHaveLength(2)
      expect(issues[0]).toEqual({
        path: ['field1'],
        message: 'Error message',
        severity: 'error'
      })
      expect(issues[1]).toEqual({
        path: ['field2'],
        message: 'Warning message',
        severity: 'warning'
      })
    })
  })
})