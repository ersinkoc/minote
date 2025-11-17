import { Position } from '../types/ast'
import { ParseError } from '../errors'

export enum TokenType {
  // Literals
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
  IDENTIFIER = 'IDENTIFIER',

  // Symbols
  COLON = 'COLON', // :
  PIPE = 'PIPE', // |
  HASH = 'HASH', // #
  AT = 'AT', // @
  DASH = 'DASH', // -
  LBRACKET = 'LBRACKET', // [
  RBRACKET = 'RBRACKET', // ]
  LBRACE = 'LBRACE', // {
  RBRACE = 'RBRACE', // }

  // Special
  NEWLINE = 'NEWLINE',
  INDENT = 'INDENT',
  DEDENT = 'DEDENT',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType
  value: string
  position: Position
}

export class Tokenizer {
  private input: string
  private pos = 0
  private line = 1
  private column = 1
  private tokens: Token[] = []
  private indentStack: number[] = [0]

  constructor(input: string) {
    this.input = input
  }

  tokenize(): Token[] {
    while (this.pos < this.input.length) {
      this.scanToken()
    }

    // Close any remaining indents
    while (this.indentStack.length > 1) {
      this.indentStack.pop()
      this.addToken(TokenType.DEDENT, '')
    }

    this.addToken(TokenType.EOF, '')
    return this.tokens
  }

  private scanToken(): void {
    const char = this.current()

    // Whitespace at start of line - track indentation
    if (this.column === 1 && char === ' ') {
      this.handleIndentation()
      return
    }

    // Skip inline whitespace
    if (char === ' ' || char === '\t') {
      this.advance()
      return
    }

    // Newline
    if (char === '\n' || char === '\r') {
      this.addToken(TokenType.NEWLINE, char)
      if (char === '\r' && this.peek() === '\n') {
        this.advance()
      }
      this.advance()
      this.line++
      this.column = 1
      return
    }

    // Comments (# at start of line or after whitespace, but not schema #Name)
    if (char === '#' && this.peek() !== '[' && /\s/.test(this.peekBehind())) {
      this.skipComment()
      return
    }

    // Single character tokens
    switch (char) {
      case ':':
        this.addToken(TokenType.COLON, char)
        this.advance()
        return
      case '|':
        this.addToken(TokenType.PIPE, char)
        this.advance()
        return
      case '#':
        this.addToken(TokenType.HASH, char)
        this.advance()
        return
      case '@':
        this.addToken(TokenType.AT, char)
        this.advance()
        return
      case '-':
        // Could be dash or negative number
        if (this.peek() === ' ' || this.isAtEnd(1)) {
          this.addToken(TokenType.DASH, char)
          this.advance()
        } else {
          this.scanNumber()
        }
        return
      case '[':
        this.addToken(TokenType.LBRACKET, char)
        this.advance()
        return
      case ']':
        this.addToken(TokenType.RBRACKET, char)
        this.advance()
        return
      case '{':
        this.addToken(TokenType.LBRACE, char)
        this.advance()
        return
      case '}':
        this.addToken(TokenType.RBRACE, char)
        this.advance()
        return
    }

    // Quoted string
    if (char === '"') {
      this.scanQuotedString()
      return
    }

    // Number
    if (this.isDigit(char) || (char === '-' && this.isDigit(this.peek()))) {
      this.scanNumber()
      return
    }

    // Identifier, keyword, or unquoted string
    if (this.isAlpha(char) || char === '_') {
      this.scanIdentifier()
      return
    }

    throw new ParseError(
      `Unexpected character: '${char}'`,
      this.getPosition(),
      this.input
    )
  }

  private handleIndentation(): void {
    let spaces = 0
    while (this.current() === ' ') {
      spaces++
      this.advance()
    }

    // Empty line - ignore
    if (this.current() === '\n' || this.current() === '\r' || this.isAtEnd()) {
      return
    }

    const currentIndent = this.indentStack[this.indentStack.length - 1]

    if (spaces > currentIndent) {
      this.indentStack.push(spaces)
      this.addToken(TokenType.INDENT, ' '.repeat(spaces))
    } else if (spaces < currentIndent) {
      while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > spaces) {
        this.indentStack.pop()
        this.addToken(TokenType.DEDENT, '')
      }

      if (this.indentStack[this.indentStack.length - 1] !== spaces) {
        throw new ParseError(
          'Inconsistent indentation',
          this.getPosition(),
          this.input
        )
      }
    }
  }

  private scanQuotedString(): void {
    const start = this.pos
    this.advance() // consume opening quote

    let value = ''
    while (!this.isAtEnd() && this.current() !== '"') {
      if (this.current() === '\\') {
        this.advance()
        if (!this.isAtEnd()) {
          value += this.current()
          this.advance()
        }
      } else {
        value += this.current()
        this.advance()
      }
    }

    if (this.isAtEnd()) {
      throw new ParseError(
        'Unterminated string',
        this.getPosition(),
        this.input
      )
    }

    this.advance() // consume closing quote
    this.addToken(TokenType.STRING, value)
  }

  private scanNumber(): void {
    const start = this.pos
    let hasDecimal = false

    // Negative sign
    if (this.current() === '-') {
      this.advance()
    }

    // Integer part
    while (this.isDigit(this.current())) {
      this.advance()
    }

    // Decimal part
    if (this.current() === '.' && this.isDigit(this.peek())) {
      hasDecimal = true
      this.advance() // consume '.'
      while (this.isDigit(this.current())) {
        this.advance()
      }
    }

    // Scientific notation
    if (this.current() === 'e' || this.current() === 'E') {
      this.advance()
      if (this.current() === '+' || this.current() === '-') {
        this.advance()
      }
      while (this.isDigit(this.current())) {
        this.advance()
      }
    }

    const value = this.input.slice(start, this.pos)
    this.addToken(TokenType.NUMBER, value)
  }

  private scanIdentifier(): void {
    const start = this.pos

    while (this.isAlphaNumeric(this.current()) || this.current() === '_' || this.current() === '-') {
      this.advance()
    }

    const value = this.input.slice(start, this.pos)

    // Check for keywords
    if (value === 'true' || value === 'false') {
      this.addToken(TokenType.BOOLEAN, value)
    } else if (value === 'null') {
      this.addToken(TokenType.NULL, value)
    } else {
      this.addToken(TokenType.IDENTIFIER, value)
    }
  }

  private skipComment(): void {
    while (!this.isAtEnd() && this.current() !== '\n') {
      this.advance()
    }
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      position: this.getPosition(),
    })
  }

  private current(): string {
    return this.input[this.pos] || ''
  }

  private peek(offset = 1): string {
    return this.input[this.pos + offset] || ''
  }

  private peekBehind(): string {
    return this.input[this.pos - 1] || ''
  }

  private advance(): void {
    if (!this.isAtEnd()) {
      this.pos++
      this.column++
    }
  }

  private isAtEnd(offset = 0): boolean {
    return this.pos + offset >= this.input.length
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9'
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char)
  }

  private getPosition(): Position {
    return {
      line: this.line,
      column: this.column,
      offset: this.pos,
    }
  }
}
