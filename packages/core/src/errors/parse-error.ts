import { Position } from '../types/ast'

export class ParseError extends Error {
  public readonly position: Position
  public readonly source?: string

  constructor(message: string, position: Position, source?: string) {
    const locationInfo = `at line ${position.line}, column ${position.column}`
    super(`${message} ${locationInfo}`)
    this.name = 'ParseError'
    this.position = position
    this.source = source

    // Maintain proper stack trace (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError)
    }
  }

  public toString(): string {
    let result = `${this.name}: ${this.message}\n`

    if (this.source) {
      const lines = this.source.split('\n')
      const line = lines[this.position.line - 1]

      if (line) {
        result += `\n${line}\n`
        result += ' '.repeat(this.position.column - 1) + '^\n'
      }
    }

    return result
  }
}
