import { MinoteParser } from '../parser/parser'
import { MinoteStringifier } from './stringifier'
import { SerializerOptions } from '../types/options'

export class MinoteFormatter {
  private parser: MinoteParser
  private stringifier: MinoteStringifier

  constructor(options: SerializerOptions = {}) {
    this.parser = new MinoteParser()
    this.stringifier = new MinoteStringifier(options)
  }

  /**
   * Format/prettify MINOTE text
   */
  format(input: string): string {
    const ast = this.parser.parse(input)
    return this.stringifier.stringify(ast.body)
  }

  /**
   * Check if input is already formatted
   */
  isFormatted(input: string): boolean {
    try {
      const formatted = this.format(input)
      return input === formatted
    } catch {
      return false
    }
  }
}
