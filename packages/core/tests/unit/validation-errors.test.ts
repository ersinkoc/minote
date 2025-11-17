import { describe, it, expect } from 'vitest'
import { ValidationError, ValidationIssue } from '../../src/errors/validation-error'

describe('ValidationError', () => {
  it('should create ValidationError with issues', () => {
    const issues: ValidationIssue[] = [
      { path: ['test'], message: 'Test error', severity: 'error' }
    ]

    const error = new ValidationError(issues)
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.name).toBe('ValidationError')
    expect(error.issues).toEqual(issues)
    expect(error.message).toBe('Validation failed: 1 error')
  })

  it('should handle multiple issues', () => {
    const issues: ValidationIssue[] = [
      { path: ['field1'], message: 'Error 1', severity: 'error' },
      { path: ['field2'], message: 'Error 2', severity: 'error' },
      { path: ['field3'], message: 'Warning', severity: 'warning' }
    ]

    const error = new ValidationError(issues)
    expect(error.hasErrors()).toBe(true)
    expect(error.hasWarnings()).toBe(true)
    expect(error.issues).toHaveLength(3)
  })

  it('should handle empty issues array', () => {
    const error = new ValidationError([])
    expect(error.hasErrors()).toBe(false)
    expect(error.hasWarnings()).toBe(false)
    expect(error.issues).toHaveLength(0)
  })

  it('should format error message correctly', () => {
    const issues: ValidationIssue[] = [
      { path: ['user', 'name'], message: 'Required field', severity: 'error' }
    ]

    const error = new ValidationError(issues)
    expect(error.message).toBe('Validation failed: 1 error')
  })

  it('should provide toString output', () => {
    const issues: ValidationIssue[] = [
      { path: ['field'], message: 'Test issue', severity: 'error' }
    ]

    const error = new ValidationError(issues)
    const result = error.toString()

    expect(result).toContain('ValidationError')
    expect(result).toContain('Test issue')
    expect(result).toContain('[ERROR]')
  })

  it('should handle both errors and warnings in summary', () => {
    // Test line 20 - when there are both errors and warnings
    const issues: ValidationIssue[] = [
      { path: ['field1'], message: 'Error 1', severity: 'error' },
      { path: ['field2'], message: 'Warning 1', severity: 'warning' },
      { path: ['field3'], message: 'Warning 2', severity: 'warning' }
    ]

    const error = new ValidationError(issues)
    expect(error.message).toBe('Validation failed: 1 error, 2 warnings')
  })

  it('should handle issues with empty paths in toString', () => {
    // Test line 36 - when issue.path is empty (root level issues)
    const issues: ValidationIssue[] = [
      { path: [], message: 'Root level error', severity: 'error' },
      { path: ['field'], message: 'Field error', severity: 'error' }
    ]

    const error = new ValidationError(issues)
    const result = error.toString()

    expect(result).toContain('[ERROR] <root>: Root level error')
    expect(result).toContain('[ERROR] field: Field error')
  })
})