export interface ValidationIssue {
  path: string[]
  message: string
  severity: 'error' | 'warning'
}

export class ValidationError extends Error {
  public readonly issues: ValidationIssue[]

  constructor(issues: ValidationIssue[]) {
    const errorCount = issues.filter(i => i.severity === 'error').length
    const warningCount = issues.filter(i => i.severity === 'warning').length

    let summary = 'Validation failed: '
    if (errorCount > 0) {
      summary += `${errorCount} error${errorCount > 1 ? 's' : ''}`
    }
    if (warningCount > 0) {
      if (errorCount > 0) summary += ', '
      summary += `${warningCount} warning${warningCount > 1 ? 's' : ''}`
    }

    super(summary)
    this.name = 'ValidationError'
    this.issues = issues

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
  }

  public toString(): string {
    let result = `${this.name}: ${this.message}\n\n`

    for (const issue of this.issues) {
      const path = issue.path.length > 0 ? issue.path.join('.') : '<root>'
      const severity = issue.severity.toUpperCase()
      result += `[${severity}] ${path}: ${issue.message}\n`
    }

    return result
  }

  public hasErrors(): boolean {
    return this.issues.some(i => i.severity === 'error')
  }

  public hasWarnings(): boolean {
    return this.issues.some(i => i.severity === 'warning')
  }
}
