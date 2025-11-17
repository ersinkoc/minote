import {
  MinoteValue,
  MinoteObject,
  MinoteArray,
  MinoteTable,
  MinoteProperty,
  SchemaDefinition,
  MinoteTableRow,
} from '../types/ast'
import { JsonConversionOptions } from '../types/options'
import { MinoteStringifier } from '../serializer/stringifier'
import {
  inferType,
  isTableCandidate,
  extractSchema,
} from '../utils/type-inference'

export class JsonToMinoteConverter {
  private options: Required<JsonConversionOptions>
  private stringifier: MinoteStringifier
  private depth = 0

  constructor(options: JsonConversionOptions = {}) {
    this.options = {
      indent: options.indent ?? 2,
      useTypes: options.useTypes ?? true,
      useTables: options.useTables ?? true,
      inlineThreshold: options.inlineThreshold ?? 3,
      minTableRows: options.minTableRows ?? 3,
      sortKeys: options.sortKeys ?? false,
      trailingNewline: options.trailingNewline ?? true,
      detectTables: options.detectTables ?? true,
      preserveTypes: options.preserveTypes ?? true,
      optimizeStrings: options.optimizeStrings ?? true,
      optimize: options.optimize ?? true,
      maxDepth: options.maxDepth ?? 1000,
    }

    this.stringifier = new MinoteStringifier(this.options)
  }

  /**
   * Convert JSON string or object to MINOTE
   */
  convert(input: string | object): string {
    this.depth = 0
    const obj = typeof input === 'string' ? JSON.parse(input) : input
    const ast = this.convertValue(obj)
    return this.stringifier.stringify(ast)
  }

  /**
   * Convert to AST (for programmatic use)
   */
  convertToAST(input: string | object): MinoteValue {
    this.depth = 0
    const obj = typeof input === 'string' ? JSON.parse(input) : input
    return this.convertValue(obj)
  }

  private convertValue(value: unknown): MinoteValue {
    // Primitives
    if (value === null || typeof value !== 'object') {
      return value as MinoteValue
    }

    // Check depth limit
    this.depth++
    if (this.depth > this.options.maxDepth) {
      throw new Error(
        `JSON conversion depth ${this.depth} exceeds maximum allowed depth of ${this.options.maxDepth}`
      )
    }

    try {
      // Array
      if (Array.isArray(value)) {
        return this.convertArray(value)
      }

      // Object
      return this.convertObject(value as Record<string, unknown>)
    } finally {
      this.depth--
    }
  }

  private convertObject(obj: Record<string, unknown>): MinoteObject {
    const keys = this.options.sortKeys ? Object.keys(obj).sort() : Object.keys(obj)

    const properties: MinoteProperty[] = keys.map(key => {
      const value = this.convertValue(obj[key])
      const typeAnnotation =
        this.options.preserveTypes && obj[key] !== null && typeof obj[key] !== 'object'
          ? inferType(obj[key])
          : undefined

      return {
        type: 'Property',
        key,
        value,
        typeAnnotation,
      }
    })

    return {
      type: 'Object',
      properties,
    }
  }

  private convertArray(arr: unknown[]): MinoteArray | MinoteTable | MinoteObject {
    // DISABLED: Table conversion is currently broken, always use other formats
    // if (
    //   this.options.detectTables &&
    //   this.options.useTables &&
    //   arr.length >= this.options.minTableRows &&
    //   isTableCandidate(arr)
    // ) {
    //   return this.convertToTable(arr as Record<string, unknown>[])
    // }

    // Check if this is an array of objects
    const hasObjects = arr.some(item => typeof item === 'object' && item !== null && !Array.isArray(item))

    if (hasObjects) {
      // Always use inline array format for arrays of objects
      // This avoids table parsing issues and flattening problems
      const elements = arr.map(item => this.convertValue(item))
      return {
        type: 'Array',
        elements,
        style: 'inline',
        typeAnnotation: { kind: 'array' as const, elementType: 's' }
      }
    }

    // Regular array of primitives
    const elements = arr.map(item => this.convertValue(item))

    // Determine style
    let style: 'inline' | 'multiline' | 'table' = 'inline'

    // Check if all elements are primitives
    const allPrimitive = elements.every(
      el =>
        typeof el === 'string' ||
        typeof el === 'number' ||
        typeof el === 'boolean' ||
        el === null
    )

    // Only use multiline for arrays of many primitives
    if (!allPrimitive) {
      // Arrays containing objects should always be inline (as JSON)
      style = 'inline'
    } else if (elements.length > 10) {
      // Long arrays of primitives can be multiline
      style = 'multiline'
    } else {
      // Small arrays of primitives should be inline
      style = 'inline'
    }

    const typeAnnotation =
      this.options.preserveTypes && arr.length > 0 && (typeof arr[0] !== 'object' || arr[0] === null)
        ? { kind: 'array' as const, elementType: inferType(arr[0]) }
        : undefined

    return {
      type: 'Array',
      elements,
      style,
      typeAnnotation,
    }
  }

  private convertToTable(arr: Record<string, unknown>[]): MinoteTable {
    const { name, fields } = extractSchema(arr)

    const schema: SchemaDefinition = {
      type: 'Schema',
      name,
      fields,
    }

    const rows: MinoteTableRow[] = arr.map(obj => ({
      type: 'TableRow',
      cells: fields.map(field => this.convertValue(obj[field.name])),
    }))

    return {
      type: 'Table',
      schema,
      rows,
    }
  }
}
