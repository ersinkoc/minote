import {
  MinoteDocument,
  MinoteValue,
  MinoteObject,
  MinoteArray,
  MinoteTable,
  MinoteProperty,
  SchemaDefinition,
  SchemaField,
  MinoteTableRow,
} from '../types/ast'
import { ParserOptions } from '../types/options'
import { ParseError } from '../errors'
import { Tokenizer, Token, TokenType } from './tokenizer'
import { unescapeString } from '../utils/string-utils'
import { parseTypeAnnotation } from '../utils/type-inference'

export class MinoteParser {
  private _options: Required<ParserOptions>
  private tokens: Token[] = []
  private current = 0
  private depth = 0

  constructor(options: ParserOptions = {}) {
    this._options = {
      strictTypes: options.strictTypes ?? false,
      allowImplicitTypes: options.allowImplicitTypes ?? true,
      tabularThreshold: options.tabularThreshold ?? 3,
      includeLocations: options.includeLocations ?? false,
      maxInputSize: options.maxInputSize ?? 10 * 1024 * 1024, // 10MB
      maxTokens: options.maxTokens ?? 1000000,
      maxDepth: options.maxDepth ?? 1000,
    }
  }

  /**
   * Parse MINOTE string to AST
   */
  parse(input: string): MinoteDocument {
    try {
      // Reset depth tracking
      this.depth = 0

      // Tokenize
      const tokenizer = new Tokenizer(input, this._options)
      this.tokens = tokenizer.tokenize()
      this.current = 0

      // Skip leading newlines
      this.skipNewlines()

      // Parse root object
      const body = this.parseObject()

      return {
        type: 'Document',
        body,
      }
    } catch (error) {
      if (error instanceof ParseError) {
        throw error
      }
      throw new ParseError(
        `Parse failed: ${error instanceof Error ? error.message : String(error)}`,
        { line: 1, column: 1, offset: 0 }
      )
    }
  }

  /**
   * Parse a single value (for testing)
   */
  parseValue(input: string): MinoteValue {
    const tokenizer = new Tokenizer(input)
    this.tokens = tokenizer.tokenize()
    this.current = 0
    this.skipNewlines()

    return this.parseAnyValue()
  }

  private parseObject(): MinoteObject {
    this.enterNested()

    try {
      const properties: MinoteProperty[] = []

      while (!this.isAtEnd() && !this.check(TokenType.DEDENT) && !this.check(TokenType.EOF)) {
        this.skipNewlines()

        if (this.isAtEnd() || this.check(TokenType.DEDENT) || this.check(TokenType.EOF)) {
          break
        }

        // Parse property
        const property = this.parseProperty()
        if (property) {
          properties.push(property)
        } else {
          // If parseProperty returns null, we should advance to avoid infinite loops
          if (!this.isAtEnd()) {
            this.advance()
          }
        }

        this.skipNewlines()
      }

      return {
        type: 'Object',
        properties,
      }
    } finally {
      this.exitNested()
    }
  }

  private parseProperty(): MinoteProperty | null {
    // Skip newlines
    this.skipNewlines()

    if (this.isAtEnd() || this.check(TokenType.DEDENT)) {
      return null
    }

    // Get key
    if (!this.check(TokenType.IDENTIFIER) && !this.check(TokenType.STRING)) {
      return null
    }

    const key = this.advance().value

    // Check for colon OR block value on next line (colon-less syntax)
    const hasColon = this.check(TokenType.COLON)

    // Special case: block value without colon (e.g., "users\n  #User[...]" or "user\n  name: Alice")
    if (!hasColon) {
      // Check if next is newline + indent (block value)
      if (this.check(TokenType.NEWLINE)) {
        const savedPos = this.current
        this.skipNewlines()

        if (this.check(TokenType.INDENT)) {
          this.advance() // consume INDENT
          // Parse the block value (could be table, object, etc.)
          const value = this.parseAnyValue()
          this.expect(TokenType.DEDENT)
          return {
            type: 'Property',
            key,
            value,
          }
        } else {
          this.current = savedPos
        }
      } else if (this.check(TokenType.INDENT)) {
        // Direct indent after property name (e.g., "users: \n  #Row[...]")
        this.advance() // consume INDENT
        // Parse the block value (could be table, object, etc.)
        const value = this.parseAnyValue()
        this.expect(TokenType.DEDENT)
        return {
          type: 'Property',
          key,
          value,
        }
      }

      // If we get here, we need a colon (inline value without colon is invalid)
      throw new ParseError(
        `Expected ':' after property key '${key}'`,
        this.peek().position
      )
    }

    this.advance() // consume ':'

    // Check if value is on same line or next line
    this.skipSpaces()

    let value: MinoteValue

    if (this.check(TokenType.NEWLINE) || this.check(TokenType.EOF)) {
      // Value on next line(s)
      this.skipNewlines()

      if (!this.check(TokenType.INDENT)) {
        // Handle empty value (property with no value)
        // After skipNewlines(), if we don't see INDENT, it means no value was provided
        value = null
      } else {
        this.advance() // consume INDENT
        value = this.parseAnyValue()
        this.expect(TokenType.DEDENT)
      }
    } else {
      // Check for empty inline value (property with colon but no value)
      if (this.check(TokenType.NEWLINE) || this.check(TokenType.DEDENT) || this.isAtEnd()) {
        // Empty value - represent as null
        value = null
      } else {
        // Inline value
        value = this.parseInlineValue()
      }
    }

    // Check for type annotation after value
    let typeAnnotation
    if (this.check(TokenType.AT)) {
      this.advance() // consume '@'
      const typeToken = this.advance()
      typeAnnotation = parseTypeAnnotation(typeToken.value)
    }

    return {
      type: 'Property',
      key,
      value,
      typeAnnotation,
    }
  }

  private parseAnyValue(): MinoteValue {
    this.skipNewlines()

    // Table
    if (this.check(TokenType.HASH)) {
      return this.parseTable()
    }

    // Array
    if (this.check(TokenType.DASH)) {
      return this.parseMultilineArray()
    }

    // Inline array
    if (this.check(TokenType.LBRACKET)) {
      return this.parseInlineArray()
    }

    // Inline object
    if (this.check(TokenType.LBRACE)) {
      return this.parseInlineObject()
    }

    // Object (nested properties)
    if (this.check(TokenType.IDENTIFIER)) {
      // Look ahead - if next is colon, newline+indent, or lbrace, it's an object
      const next = this.peekNext()
      const nextAfterThat = this.peekNextNext()
      if (next && (
        next.type === TokenType.COLON ||
        (next.type === TokenType.NEWLINE && nextAfterThat && nextAfterThat.type === TokenType.INDENT) ||
        next.type === TokenType.LBRACE
      )) {
        if (next.type === TokenType.LBRACE) {
          // Special case: identifier{...} - treat as inline object with the identifier as name
          const identifier = this.advance().value // consume identifier
          this.advance() // consume LBRACE
          const inlineObject = this.parseInlineObjectContent()
          return inlineObject
        } else {
          return this.parseObject()
        }
      }
    }

    // Primitive value
    return this.parsePrimitive()
  }

  private parseInlineValue(): MinoteValue {
    // Inline array
    if (this.check(TokenType.LBRACKET)) {
      return this.parseInlineArray()
    }

    // Inline object
    if (this.check(TokenType.LBRACE)) {
      return this.parseInlineObject()
    }

    // Primitive
    return this.parsePrimitive()
  }

  private parsePrimitive(): MinoteValue {
    const token = this.advance()
    let value: any

    switch (token.type) {
      case TokenType.STRING:
        value = token.value // Tokenizer already handles unescaping
        break
      case TokenType.NUMBER:
        value = parseFloat(token.value)
        break
      case TokenType.BOOLEAN:
        value = token.value === 'true'
        break
      case TokenType.NULL:
        value = null
        break
      case TokenType.IDENTIFIER:
        value = token.value
        break
      default:
        throw new ParseError(
          `Unexpected token type: ${token.type}`,
          token.position
        )
    }

    return value
  }

  private parseInlineArray(): MinoteArray {
    this.enterNested()

    try {
      this.expect(TokenType.LBRACKET)

      const elements: MinoteValue[] = []

      while (!this.check(TokenType.RBRACKET) && !this.isAtEnd()) {
        this.skipSpaces()

        if (this.check(TokenType.RBRACKET)) {
          break
        }

        // Check if we have a multiline element (newline after opening bracket)
        if (this.check(TokenType.NEWLINE)) {
          // Switch to multiline array parsing mode
          return this.parseMultilineArrayFromInline(elements)
        }

        elements.push(this.parseInlineValue())

        this.skipSpaces()
      }

      this.expect(TokenType.RBRACKET)

      return {
        type: 'Array',
        elements,
        style: 'inline',
      }
    } finally {
      this.exitNested()
    }
  }

  private parseMultilineArrayFromInline(elements: MinoteValue[] = []): MinoteArray {
    // Skip the newline we detected
    this.skipNewlines()

    while (this.check(TokenType.DASH)) {
      this.advance() // consume '-'
      this.skipSpaces()

      elements.push(this.parseInlineValue())

      this.skipNewlines()
    }

    this.expect(TokenType.RBRACKET)

    return {
      type: 'Array',
      elements,
      style: 'multiline',
    }
  }

  private parseMultilineArray(): MinoteArray {
    this.enterNested()

    try {
      const elements: MinoteValue[] = []

      while (this.check(TokenType.DASH)) {
        this.advance() // consume '-'
        this.skipSpaces()

        elements.push(this.parseInlineValue())

        this.skipNewlines()
      }

      return {
        type: 'Array',
        elements,
        style: 'multiline',
      }
    } finally {
      this.exitNested()
    }
  }

  private parseInlineObject(): MinoteObject {
    this.enterNested()

    try {
      this.expect(TokenType.LBRACE)

      const properties: MinoteProperty[] = []

      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        this.skipSpaces()

        if (this.check(TokenType.RBRACE)) {
          break
        }

        // Key
        const key = this.advance().value

        this.expect(TokenType.COLON)

        // Value
        const value = this.parseInlineValue()

        properties.push({
          type: 'Property',
          key,
          value,
          inline: true,
        })

        this.skipSpaces()
      }

      this.expect(TokenType.RBRACE)

      return {
        type: 'Object',
        properties,
      }
    } finally {
      this.exitNested()
    }
  }

  private parseInlineObjectContent(): MinoteObject {
    this.enterNested()

    try {
      const properties: MinoteProperty[] = []

      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        this.skipSpaces()

        if (this.check(TokenType.RBRACE)) {
          break
        }

        // Key
        const key = this.advance().value

        this.expect(TokenType.COLON)

        // Value
        const value = this.parseInlineValue()

        properties.push({
          type: 'Property',
          key,
          value,
          inline: true,
        })

        this.skipSpaces()
      }

      this.expect(TokenType.RBRACE)

      return {
        type: 'Object',
        properties,
      }
    } finally {
      this.exitNested()
    }
  }

  private parseTable(): MinoteTable {
    // Parse schema: #Name[field1@type field2@type]
    this.expect(TokenType.HASH)

    const schemaName = this.advance().value

    this.expect(TokenType.LBRACKET)

    const fields: SchemaField[] = []

    while (!this.check(TokenType.RBRACKET) && !this.isAtEnd()) {
      this.skipSpaces()

      if (this.check(TokenType.RBRACKET)) {
        break
      }

      // Field name
      const fieldName = this.advance().value

      // Type annotation
      this.expect(TokenType.AT)
      const typeToken = this.advance()
      const fieldType = parseTypeAnnotation(typeToken.value)

      fields.push({
        name: fieldName,
        type: fieldType,
      })

      this.skipSpaces()
    }

    this.expect(TokenType.RBRACKET)

    const schema: SchemaDefinition = {
      type: 'Schema',
      name: schemaName,
      fields,
    }

    // Parse rows
    this.skipNewlines()

    const rows: MinoteTableRow[] = []

    while (this.check(TokenType.PIPE)) {
      rows.push(this.parseTableRow(fields.length))
      this.skipNewlines()
    }

    return {
      type: 'Table',
      schema,
      rows,
    }
  }

  private parseTableRow(fieldCount: number): MinoteTableRow {
    this.expect(TokenType.PIPE)

    const cells: MinoteValue[] = []

    for (let i = 0; i < fieldCount; i++) {
      // Parse cell value
      const cell = this.parsePrimitive()
      cells.push(cell)

      // Expect pipe separator (or end)
      if (i < fieldCount - 1 || !this.check(TokenType.NEWLINE)) {
        this.expect(TokenType.PIPE)
      }
    }

    return {
      type: 'TableRow',
      cells,
    }
  }

  // Helper methods

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++
    }
    return this.previous()
  }

  private expect(type: TokenType): Token {
    if (this.check(type)) {
      return this.advance()
    }

    const token = this.peek()
    throw new ParseError(
      `Expected ${type}, but got ${token.type}`,
      token.position
    )
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private peekNext(): Token | undefined {
    return this.tokens[this.current + 1]
  }

  private peekNextNext(): Token | undefined {
    return this.tokens[this.current + 2]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length || this.peek().type === TokenType.EOF
  }

  private skipNewlines(): void {
    while (this.check(TokenType.NEWLINE)) {
      this.advance()
    }
  }

  private skipSpaces(): void {
    // Spaces are already handled by tokenizer
    // This is a no-op but kept for clarity
  }

  private enterNested(): void {
    this.depth++
    if (this.depth > this._options.maxDepth) {
      throw new ParseError(
        `Nesting depth ${this.depth} exceeds maximum allowed depth of ${this._options.maxDepth}`,
        this.peek().position
      )
    }
  }

  private exitNested(): void {
    this.depth--
  }
}
