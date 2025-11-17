import {
  MinoteValue,
  MinoteObject,
  MinoteArray,
  MinoteTable,
  isMinoteObject,
  isMinoteArray,
  isMinoteTable,
} from '../types/ast'
import { SerializerOptions } from '../types/options'
import { formatString } from '../utils/string-utils'
import { formatTypeAnnotation } from '../utils/type-inference'
import { indent } from '../utils/indent'

export class MinoteStringifier {
  private options: Required<SerializerOptions>

  constructor(options: SerializerOptions = {}) {
    this.options = {
      indent: options.indent ?? 2,
      useTypes: options.useTypes ?? true,
      useTables: options.useTables ?? true,
      inlineThreshold: options.inlineThreshold ?? 3,
      minTableRows: options.minTableRows ?? 3,
      sortKeys: options.sortKeys ?? false,
      trailingNewline: options.trailingNewline ?? true,
    }
  }

  /**
   * Convert AST to MINOTE string
   */
  stringify(value: MinoteValue, depth = 0): string {
    let result = this.stringifyValue(value, depth)

    // Add trailing newline if at root level
    if (depth === 0 && this.options.trailingNewline && !result.endsWith('\n')) {
      result += '\n'
    }

    return result
  }

  private stringifyValue(value: MinoteValue, depth: number): string {
    // Primitives
    if (typeof value === 'string') {
      return formatString(value)
    }

    if (typeof value === 'number') {
      return String(value)
    }

    if (typeof value === 'boolean') {
      return String(value)
    }

    if (value === null) {
      return 'null'
    }

    // Complex types
    if (isMinoteTable(value)) {
      return this.stringifyTable(value, depth)
    }

    if (isMinoteArray(value)) {
      return this.stringifyArray(value, depth)
    }

    if (isMinoteObject(value)) {
      return this.stringifyObject(value, depth)
    }

    throw new Error(`Unknown value type: ${typeof value}`)
  }

  private stringifyObject(obj: MinoteObject, depth: number): string {
    const ind = indent(depth, this.options.indent)
    const nextInd = indent(depth + 1, this.options.indent)

    let result = ''
    const properties = this.options.sortKeys
      ? [...obj.properties].sort((a, b) => a.key.localeCompare(b.key))
      : obj.properties

    for (const prop of properties) {
      const key = formatString(prop.key)
      const typeAnnotation =
        this.options.useTypes && prop.typeAnnotation
          ? formatTypeAnnotation(prop.typeAnnotation)
          : ''

      // Check if should be inlined
      if (this.shouldInline(prop.value)) {
        const value = this.stringifyValue(prop.value, depth + 1)
        result += `${nextInd}${key}: ${value}${typeAnnotation}\n`
      } else {
        // Multi-line value
        result += `${nextInd}${key}${typeAnnotation}:\n`
        const valueStr = this.stringifyValue(prop.value, depth + 2)
        result += valueStr
      }
    }

    return result
  }

  private stringifyArray(arr: MinoteArray, depth: number): string {
    if (arr.style === 'inline' || this.shouldInline(arr)) {
      return this.stringifyInlineArray(arr)
    }

    return this.stringifyMultilineArray(arr, depth)
  }

  private stringifyInlineArray(arr: MinoteArray): string {
    const elements = arr.elements.map(el => this.stringifyValue(el, 0))
    return `[${elements.join(' ')}]`
  }

  private stringifyMultilineArray(arr: MinoteArray, depth: number): string {
    const ind = indent(depth, this.options.indent)
    let result = ''

    for (const element of arr.elements) {
      result += `${ind}- ${this.stringifyValue(element, depth)}\n`
    }

    return result
  }

  private stringifyTable(table: MinoteTable, depth: number): string {
    const ind = indent(depth, this.options.indent)

    // Schema line
    const fields = table.schema.fields
      .map(f => `${f.name}${this.options.useTypes ? '@' + f.type : ''}`)
      .join(' ')

    let result = `${ind}#${table.schema.name}[${fields}]\n`

    // Rows
    for (const row of table.rows) {
      const cells = row.cells.map(cell => this.formatCell(cell))
      result += `${ind}|${cells.join('|')}|\n`
    }

    return result
  }

  private formatCell(value: MinoteValue): string {
    if (typeof value === 'string') {
      return value
    }

    if (typeof value === 'number') {
      return String(value)
    }

    if (typeof value === 'boolean') {
      return String(value)
    }

    if (value === null) {
      return ''
    }

    return String(value)
  }

  private shouldInline(value: MinoteValue): boolean {
    // Always inline primitives
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      return true
    }

    // Inline small objects
    if (isMinoteObject(value)) {
      return value.properties.length <= this.options.inlineThreshold &&
        value.properties.every(p => this.shouldInline(p.value))
    }

    // Inline small arrays
    if (isMinoteArray(value)) {
      return value.elements.length <= this.options.inlineThreshold &&
        value.elements.every(el => this.shouldInline(el))
    }

    // Never inline tables
    if (isMinoteTable(value)) {
      return false
    }

    return false
  }
}
