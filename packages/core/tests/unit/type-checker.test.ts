import { describe, it, expect } from 'vitest'
import { TypeChecker } from '../../src/validator/type-checker'
import type { TypeAnnotation } from '../../src/types/ast'

describe('TypeChecker', () => {
  let typeChecker: TypeChecker

  beforeEach(() => {
    typeChecker = new TypeChecker()
  })

  describe('check method', () => {
    it('should create TypeChecker instance', () => {
      expect(typeChecker).toBeInstanceOf(TypeChecker)
    })

    it('should check string type', () => {
      const result = typeChecker.check('test', 's')
      expect(typeof result).toBe('boolean')
    })

    it('should check integer type', () => {
      const result = typeChecker.check(42, 'i')
      expect(typeof result).toBe('boolean')
    })

    it('should check float type', () => {
      const result = typeChecker.check(3.14, 'f')
      expect(typeof result).toBe('boolean')
    })

    it('should check boolean type', () => {
      const result = typeChecker.check(true, 'b')
      expect(typeof result).toBe('boolean')
    })

    it('should check null type', () => {
      const result = typeChecker.check(null, 'null')
      expect(typeof result).toBe('boolean')
    })

    it('should check with complex type annotation', () => {
      const complexType: TypeAnnotation = {
        kind: 'primitive',
        type: 's'
      }
      const result = typeChecker.check('test', complexType)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('coerce method', () => {
    it('should coerce string to integer type "i"', () => {
      const result = typeChecker.coerce('42', 'i')
      expect(typeof result).toBe('number')
      expect(result).toBe(42)
    })

    it('should coerce string to integer type "int"', () => {
      const result = typeChecker.coerce('123', 'int')
      expect(typeof result).toBe('number')
      expect(result).toBe(123)
    })

    it('should coerce string to integer type "i32"', () => {
      const result = typeChecker.coerce('456', 'i32')
      expect(typeof result).toBe('number')
      expect(result).toBe(456)
    })

    it('should coerce string to integer type "i64"', () => {
      const result = typeChecker.coerce('789', 'i64')
      expect(typeof result).toBe('number')
      expect(result).toBe(789)
    })

    it('should handle invalid string for integer coercion', () => {
      const result = typeChecker.coerce('not-a-number', 'i')
      expect(result).toBe('not-a-number') // Should return original value
    })

    it('should coerce string to float type "f"', () => {
      const result = typeChecker.coerce('3.14', 'f')
      expect(typeof result).toBe('number')
      expect(result).toBe(3.14)
    })

    it('should coerce string to float type "float"', () => {
      const result = typeChecker.coerce('2.71', 'float')
      expect(typeof result).toBe('number')
      expect(result).toBe(2.71)
    })

    it('should coerce string to float type "f32"', () => {
      const result = typeChecker.coerce('1.5', 'f32')
      expect(typeof result).toBe('number')
      expect(result).toBe(1.5)
    })

    it('should coerce string to float type "f64"', () => {
      const result = typeChecker.coerce('0.75', 'f64')
      expect(typeof result).toBe('number')
      expect(result).toBe(0.75)
    })

    it('should handle invalid string for float coercion', () => {
      const result = typeChecker.coerce('not-a-float', 'f')
      expect(result).toBe('not-a-float') // Should return original value
    })

    it('should coerce string "true" to boolean type "b"', () => {
      const result = typeChecker.coerce('true', 'b')
      expect(typeof result).toBe('boolean')
      expect(result).toBe(true)
    })

    it('should coerce string "false" to boolean type "b"', () => {
      const result = typeChecker.coerce('false', 'b')
      expect(typeof result).toBe('boolean')
      expect(result).toBe(false)
    })

    it('should coerce string "true" to boolean type "bool"', () => {
      const result = typeChecker.coerce('true', 'bool')
      expect(typeof result).toBe('boolean')
      expect(result).toBe(true)
    })

    it('should coerce string "false" to boolean type "bool"', () => {
      const result = typeChecker.coerce('false', 'bool')
      expect(typeof result).toBe('boolean')
      expect(result).toBe(false)
    })

    it('should handle non-boolean strings for boolean coercion', () => {
      const result = typeChecker.coerce('maybe', 'b')
      expect(result).toBe('maybe') // Should return original value
    })

    it('should return original number when trying to coerce to integer', () => {
      const result = typeChecker.coerce(42, 'i')
      expect(result).toBe(42)
    })

    it('should return original number when trying to coerce to float', () => {
      const result = typeChecker.coerce(3.14, 'f')
      expect(result).toBe(3.14)
    })

    it('should return original boolean when trying to coerce to boolean', () => {
      const result = typeChecker.coerce(true, 'b')
      expect(result).toBe(true)
    })

    it('should return original value for unknown type', () => {
      const result = typeChecker.coerce('test', 'unknown')
      expect(result).toBe('test')
    })

    it('should return original null when trying to coerce', () => {
      const result = typeChecker.coerce(null, 's')
      expect(result).toBe(null)
    })

    it('should handle complex type annotation in coerce', () => {
      const complexType: TypeAnnotation = {
        kind: 'primitive',
        type: 's'
      }
      const result = typeChecker.coerce('test', complexType)
      expect(result).toBe('test') // Should return original value for complex types
    })

    it('should handle empty string for integer coercion', () => {
      const result = typeChecker.coerce('', 'i')
      expect(result).toBe('')
    })

    it('should handle empty string for float coercion', () => {
      const result = typeChecker.coerce('', 'f')
      expect(result).toBe('')
    })

    it('should handle whitespace string for integer coercion', () => {
      const result = typeChecker.coerce('   ', 'i')
      expect(result).toBe('   ')
    })

    it('should handle whitespace string for float coercion', () => {
      const result = typeChecker.coerce('   ', 'f')
      expect(result).toBe('   ')
    })

    it('should handle decimal string for integer coercion', () => {
      const result = typeChecker.coerce('42.5', 'i')
      expect(typeof result).toBe('number') // parseInt will parse '42.5' as 42
      expect(result).toBe(42)
    })

    it('should handle integer string for float coercion', () => {
      const result = typeChecker.coerce('42', 'f')
      expect(typeof result).toBe('number')
      expect(result).toBe(42)
    })

    it('should handle mixed case boolean strings', () => {
      const result1 = typeChecker.coerce('True', 'b')
      const result2 = typeChecker.coerce('False', 'b')
      expect(result1).toBe('True') // Should not coerce mixed case
      expect(result2).toBe('False') // Should not coerce mixed case
    })
  })
})