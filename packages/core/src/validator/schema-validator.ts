import { MinoteValue, SchemaDefinition } from '../types/ast'
import { ValidationOptions } from '../types/options'
import { ValidationError, ValidationIssue } from '../errors'

export class SchemaValidator {
  private options: Required<ValidationOptions>
  private issues: ValidationIssue[] = []

  constructor(options: ValidationOptions = {}) {
    this.options = {
      allowExtraFields: options.allowExtraFields ?? false,
      coerceTypes: options.coerceTypes ?? false,
      strict: options.strict ?? false,
    }
  }

  validate(value: MinoteValue, schema: SchemaDefinition): void {
    this.issues = []
    // Basic validation stub
    // Full implementation would validate types, required fields, etc.

    if (this.issues.length > 0) {
      throw new ValidationError(this.issues)
    }
  }

  private addIssue(path: string[], message: string, severity: 'error' | 'warning' = 'error'): void {
    this.issues.push({ path, message, severity })
  }
}
