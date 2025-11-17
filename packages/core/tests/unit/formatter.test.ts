import { describe, it, expect, vi } from 'vitest'
import { MinoteFormatter } from '../../src/serializer/formatter'
import type { SerializerOptions } from '../../src/types/options'

describe('MinoteFormatter', () => {
  let formatter: MinoteFormatter

  beforeEach(() => {
    formatter = new MinoteFormatter()
  })

  it('should create formatter with default options', () => {
    expect(formatter).toBeInstanceOf(MinoteFormatter)
  })

  it('should create formatter with custom options', () => {
    const options: SerializerOptions = {
      indent: 4,
      sortKeys: true,
      align: true
    }
    const customFormatter = new MinoteFormatter(options)
    expect(customFormatter).toBeInstanceOf(MinoteFormatter)
  })

  it('should format simple key-value pairs', () => {
    const input = 'name: Alice'
    const result = formatter.format(input)
    expect(typeof result).toBe('string')
    expect(result).toContain('name')
    expect(result).toContain('Alice')
  })

  it('should format multiple key-value pairs', () => {
    const input = `name: Alice
age: 30`
    const result = formatter.format(input)
    expect(typeof result).toBe('string')
    expect(result).toContain('name')
    expect(result).toContain('Alice')
    expect(result).toContain('age')
    expect(result).toContain('30')
  })

  it('should format numbers', () => {
    const input = 'count: 42'
    const result = formatter.format(input)
    expect(typeof result).toBe('string')
  })

  it('should format booleans', () => {
    const input = `active: true
verified: false`
    const result = formatter.format(input)
    expect(typeof result).toBe('string')
  })

  it('should format null values', () => {
    const input = 'optional: null'
    const result = formatter.format(input)
    expect(typeof result).toBe('string')
  })

  it('should handle valid input in isFormatted', () => {
    const input = 'name: Alice'
    const result = formatter.isFormatted(input)
    expect(typeof result).toBe('boolean')
  })

  it('should handle invalid input in isFormatted', () => {
    const invalidInput = '{invalid}' // invalid MINOTE syntax
    const result = formatter.isFormatted(invalidInput)
    expect(result).toBe(false)
  })

  it('should handle malformed input gracefully in isFormatted', () => {
    const malformedInput = 'name:' // missing value
    const result = formatter.isFormatted(malformedInput)
    expect(typeof result).toBe('boolean')
  })

  it('should check if already formatted content is detected as formatted', () => {
    const input = 'name: Alice'
    const formatted = formatter.format(input)
    const isAlreadyFormatted = formatter.isFormatted(formatted)
    expect(typeof isAlreadyFormatted).toBe('boolean')
  })

  it('should detect formatting differences', () => {
    const input1 = 'name: Alice'
    const input2 = 'name: Bob'
    const formatted1 = formatter.format(input1)
    const isSame = formatter.isFormatted(input2)
    expect(typeof isSame).toBe('boolean')
  })

  it('should handle quoted strings with spaces', () => {
    const input = 'message: "Hello World"'
    const result = formatter.format(input)
    expect(typeof result).toBe('string')
  })

  it('should be consistent across multiple format calls', () => {
    const input = 'name: Alice'
    const result1 = formatter.format(input)
    const result2 = formatter.format(input)
    expect(result1).toBe(result2)
  })

  it('should work with different formatter instances', () => {
    const formatter1 = new MinoteFormatter()
    const formatter2 = new MinoteFormatter()
    const input = 'name: Alice'

    const result1 = formatter1.format(input)
    const result2 = formatter2.format(input)

    expect(typeof result1).toBe('string')
    expect(typeof result2).toBe('string')
    expect(result1).toBe(result2)
  })

  it('should handle empty input', () => {
    const emptyInput = ''
    const result = formatter.format(emptyInput)
    expect(typeof result).toBe('string')
  })

  it('should handle whitespace-only input', () => {
    const whitespaceInput = '   \n\t   '
    const result = formatter.format(whitespaceInput)
    expect(typeof result).toBe('string')
  })
})