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

  constructor(options: ParserOptions = {}) {
    this._options = {
      strictTypes: options.strictTypes ?? false,
      allowImplicitTypes: options.allowImplicitTypes ?? true,
      tabularThreshold: options.tabularThreshold ?? 3,
      includeLocations: options.includeLocations ?? false,
    }
  }

  /**
   * Parse MINOTE string to AST
   */
  parse(input: string): MinoteDocument {
    try {
      // Tokenize
      const tokenizer = new Tokenizer(input)
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
      }

      // If we get here, we need a colon (inline value without colon is invalid)
      throw new ParseError(
        `Expected ':' after property key '${key}'`,
        this.peek().position
      )
    }

    this.advance() // consume ':'

    // Check for type annotation
    let typeAnnotation
    if (this.check(TokenType.AT)) {
      this.advance() // consume '@'
      const typeToken = this.advance()
      typeAnnotation = parseTypeAnnotation(typeToken.value)
    }

    // Check if value is on same line or next line
    this.skipSpaces()

    let value: MinoteValue

    if (this.check(TokenType.NEWLINE) || this.check(TokenType.EOF)) {
      // Value on next line(s)
      this.skipNewlines()

      if (!this.check(TokenType.INDENT)) {
        throw new ParseError(
          `Expected indented value for property '${key}'`,
          this.peek().position
        )
      }

      this.advance() // consume INDENT
      value = this.parseAnyValue()
      this.expect(TokenType.DEDENT)
    } else {
      // Inline value
      value = this.parseInlineValue()
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
      // Look ahead - if next is colon, it's an object
      const next = this.peekNext()
      if (next && next.type === TokenType.COLON) {
        return this.parseObject()
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
        value = unescapeString(token.value)
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

    // Skip any type annotation (@type) after primitive values
    if (this.check(TokenType.AT)) {
      this.advance() // consume '@'
      if (!this.isAtEnd() && !this.check(TokenType.NEWLINE) && !this.check(TokenType.EOF)) {
        this.advance() // consume type identifier
      }
    }

    return value
  }

  private parseInlineArray(): MinoteArray {
    this.expect(TokenType.LBRACKET)

    const elements: MinoteValue[] = []

    while (!this.check(TokenType.RBRACKET) && !this.isAtEnd()) {
      this.skipSpaces()

      if (this.check(TokenType.RBRACKET)) {
        break
      }

      elements.push(this.parsePrimitive())

      this.skipSpaces()
    }

    this.expect(TokenType.RBRACKET)

    return {
      type: 'Array',
      elements,
      style: 'inline',
    }
  }

  private parseMultilineArray(): MinoteArray {
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
  }

  private parseInlineObject(): MinoteObject {
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
      const value = this.parsePrimitive()

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
}
