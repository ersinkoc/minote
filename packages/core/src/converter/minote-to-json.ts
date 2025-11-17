import {
  MinoteValue,
  MinoteObject,
  MinoteArray,
  MinoteTable,
  isMinoteObject,
  isMinoteArray,
  isMinoteTable,
} from '../types/ast'
import { MinoteParser } from '../parser/parser'

export interface MinoteToJsonOptions {
  /**
   * Pretty-print JSON
   * @default true
   */
  pretty?: boolean

  /**
   * Indent size for pretty printing
   * @default 2
   */
  indent?: number

  /**
   * Maximum depth for recursive conversion to prevent stack overflow
   * @default 1000
   */
  maxDepth?: number
}

export class MinoteToJsonConverter {
  private options: Required<MinoteToJsonOptions>
  private parser: MinoteParser
  private depth = 0

  constructor(options: MinoteToJsonOptions = {}) {
    this.options = {
      pretty: options.pretty ?? true,
      indent: options.indent ?? 2,
      maxDepth: options.maxDepth ?? 1000,
    }

    this.parser = new MinoteParser()
  }

  /**
   * Convert MINOTE string to JSON
   */
  convert(minote: string): string {
    this.depth = 0
    const ast = this.parser.parse(minote)
    const obj = this.astToObject(ast.body)

    return this.options.pretty
      ? JSON.stringify(obj, null, this.options.indent)
      : JSON.stringify(obj)
  }

  /**
   * Convert MINOTE to JavaScript object
   */
  convertToObject(minote: string): unknown {
    this.depth = 0
    const ast = this.parser.parse(minote)
    return this.astToObject(ast.body)
  }

  private astToObject(value: MinoteValue): unknown {
    // Primitives
    if (value === null || typeof value !== 'object') {
      return value
    }

    // Check depth limit
    this.depth++
    if (this.depth > this.options.maxDepth) {
      throw new Error(
        `JSON conversion depth ${this.depth} exceeds maximum allowed depth of ${this.options.maxDepth}`
      )
    }

    try {
      // Object
      if (isMinoteObject(value)) {
        return this.objectToJs(value)
      }

      // Array
      if (isMinoteArray(value)) {
        return this.arrayToJs(value)
      }

      // Table
      if (isMinoteTable(value)) {
        return this.tableToJs(value)
      }

      throw new Error(
        `Unknown AST node type. Expected MinoteObject, MinoteArray, or MinoteTable, but got: ${JSON.stringify(value)}`
      )
    } finally {
      this.depth--
    }
  }

  private objectToJs(obj: MinoteObject): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const prop of obj.properties) {
      result[prop.key] = this.astToObject(prop.value)
    }

    return result
  }

  private arrayToJs(arr: MinoteArray): unknown[] {
    return arr.elements.map(el => this.astToObject(el))
  }

  private tableToJs(table: MinoteTable): Record<string, unknown>[] {
    return table.rows.map(row => {
      const obj: Record<string, unknown> = {}

      row.cells.forEach((cell, i) => {
        const field = table.schema.fields[i]
        if (!field) {
          throw new Error(
            `Table row has more cells (${row.cells.length}) than schema fields (${table.schema.fields.length})`
          )
        }
        obj[field.name] = this.astToObject(cell)
      })

      return obj
    })
  }
}
