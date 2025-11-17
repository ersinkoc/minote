/**
 * Parser configuration
 */
export interface ParserOptions {
  /**
   * Require type annotations for all values
   * @default false
   */
  strictTypes?: boolean

  /**
   * Allow type inference from values
   * @default true
   */
  allowImplicitTypes?: boolean

  /**
   * Minimum number of rows to suggest table format
   * @default 3
   */
  tabularThreshold?: number

  /**
   * Include source locations in AST
   * @default false
   */
  includeLocations?: boolean
}

/**
 * Serializer configuration
 */
export interface SerializerOptions {
  /**
   * Number of spaces for indentation
   * @default 2
   */
  indent?: number

  /**
   * Include type annotations in output
   * @default true
   */
  useTypes?: boolean

  /**
   * Convert repetitive arrays to table format
   * @default true
   */
  useTables?: boolean

  /**
   * Inline objects/arrays with N or fewer items
   * @default 3
   */
  inlineThreshold?: number

  /**
   * Minimum rows required to use table format
   * @default 3
   */
  minTableRows?: number

  /**
   * Sort object keys alphabetically
   * @default false
   */
  sortKeys?: boolean

  /**
   * Add trailing newline
   * @default true
   */
  trailingNewline?: boolean
}

/**
 * JSON conversion options
 */
export interface JsonConversionOptions extends SerializerOptions {
  /**
   * Automatically detect and convert to tables
   * @default true
   */
  detectTables?: boolean

  /**
   * Infer and preserve type information
   * @default true
   */
  preserveTypes?: boolean

  /**
   * Remove quotes from strings when safe
   * @default true
   */
  optimizeStrings?: boolean

  /**
   * Analyze and optimize for token efficiency
   * @default true
   */
  optimize?: boolean
}

/**
 * Validation options
 */
export interface ValidationOptions {
  /**
   * Allow extra fields not in schema
   * @default false
   */
  allowExtraFields?: boolean

  /**
   * Coerce types when possible (e.g., "123" → 123)
   * @default false
   */
  coerceTypes?: boolean

  /**
   * Treat warnings as errors
   * @default false
   */
  strict?: boolean
}
