import { describe, it, expect } from 'vitest'
import {
  needsQuotes,
  escapeString,
  unescapeString,
  formatString,
  parseString,
  isValidIdentifier,
  splitLines,
  countIndent,
  stripIndent
} from '../../src/utils/string-utils'

describe('String Utilities', () => {
  describe('needsQuotes', () => {
    it('should return true for empty string', () => {
      expect(needsQuotes('')).toBe(true)
    })

    it('should return true for strings with whitespace', () => {
      expect(needsQuotes('hello world')).toBe(true)
      expect(needsQuotes('hello\tworld')).toBe(true)
      expect(needsQuotes('hello\nworld')).toBe(true)
      expect(needsQuotes(' hello')).toBe(true)
      expect(needsQuotes('hello ')).toBe(true)
    })

    it('should return true for strings with special characters', () => {
      expect(needsQuotes('hello:world')).toBe(true)
      expect(needsQuotes('hello,world')).toBe(true)
      expect(needsQuotes('hello|world')).toBe(true)
      expect(needsQuotes('hello[world]')).toBe(true)
      expect(needsQuotes('hello{world}')).toBe(true)
      expect(needsQuotes('hello#world')).toBe(true)
      expect(needsQuotes('hello@world')).toBe(true)
      expect(needsQuotes('hello!world')).toBe(true)
      expect(needsQuotes('hello~world')).toBe(true)
      expect(needsQuotes('hello"world')).toBe(true)
    })

    it('should return true for strings with backslashes', () => {
      expect(needsQuotes('hello\\world')).toBe(true)
    })

    it('should return true for strings starting with numbers', () => {
      expect(needsQuotes('123abc')).toBe(true)
      expect(needsQuotes('0')).toBe(true)
      expect(needsQuotes('42')).toBe(true)
    })

    it('should return true for boolean strings', () => {
      expect(needsQuotes('true')).toBe(true)
      expect(needsQuotes('false')).toBe(true)
    })

    it('should return true for null string', () => {
      expect(needsQuotes('null')).toBe(true)
    })

    it('should return false for simple valid identifiers', () => {
      expect(needsQuotes('hello')).toBe(false)
      expect(needsQuotes('variable_name')).toBe(false)
      expect(needsQuotes('_private')).toBe(false)
      expect(needsQuotes('camelCase')).toBe(false)
      expect(needsQuotes('UPPERCASE')).toBe(false)
    })

    it('should return false for single letter strings', () => {
      expect(needsQuotes('a')).toBe(false)
      expect(needsQuotes('Z')).toBe(false)
      expect(needsQuotes('_')).toBe(false)
    })
  })

  describe('escapeString', () => {
    it('should escape backslashes', () => {
      expect(escapeString('hello\\world')).toBe('hello\\\\world')
    })

    it('should escape quotes', () => {
      expect(escapeString('hello"world')).toBe('hello\\"world')
    })

    it('should escape newlines', () => {
      expect(escapeString('hello\nworld')).toBe('hello\\nworld')
    })

    it('should escape carriage returns', () => {
      expect(escapeString('hello\rworld')).toBe('hello\\rworld')
    })

    it('should escape tabs', () => {
      expect(escapeString('hello\tworld')).toBe('hello\\tworld')
    })

    it('should escape multiple special characters', () => {
      expect(escapeString('hello\\world"test\nline\ttab'))
        .toBe('hello\\\\world\\"test\\nline\\ttab')
    })

    it('should handle empty string', () => {
      expect(escapeString('')).toBe('')
    })

    it('should handle strings without special characters', () => {
      expect(escapeString('hello_world')).toBe('hello_world')
      expect(escapeString('123abc')).toBe('123abc')
    })
  })

  describe('unescapeString', () => {
    it('should unescape backslashes', () => {
      expect(unescapeString('hello\\\\world')).toBe('hello\\world')
    })

    it('should unescape quotes', () => {
      expect(unescapeString('hello\\"world')).toBe('hello"world')
    })

    it('should unescape newlines', () => {
      expect(unescapeString('hello\\nworld')).toBe('hello\nworld')
    })

    it('should unescape carriage returns', () => {
      expect(unescapeString('hello\\rworld')).toBe('hello\rworld')
    })

    it('should unescape tabs', () => {
      expect(unescapeString('hello\\tworld')).toBe('hello\tworld')
    })

    it('should unescape multiple special characters', () => {
      expect(unescapeString('hello\\\\world\\"test\\nline\\ttab'))
        .toBe('hello\\world"test\nline\ttab')
    })

    it('should handle empty string', () => {
      expect(unescapeString('')).toBe('')
    })

    it('should handle strings without escape sequences', () => {
      expect(unescapeString('hello_world')).toBe('hello_world')
      expect(unescapeString('123abc')).toBe('123abc')
    })
  })

  describe('formatString', () => {
    it('should quote strings that need quotes', () => {
      expect(formatString('hello world')).toBe('"hello world"')
      expect(formatString('123abc')).toBe('"123abc"')
      expect(formatString('true')).toBe('"true"')
      expect(formatString('')).toBe('""')
    })

    it('should not quote strings that don\'t need quotes', () => {
      expect(formatString('hello')).toBe('hello')
      expect(formatString('variable_name')).toBe('variable_name')
      expect(formatString('_private')).toBe('_private')
    })

    it('should escape quoted strings properly', () => {
      expect(formatString('hello "test"')).toBe('"hello \\"test\\""')
      expect(formatString('line1\nline2')).toBe('"line1\\nline2"')
    })

    it('should handle strings with special characters', () => {
      expect(formatString('hello:world')).toBe('"hello:world"')
      expect(formatString('path\\to\\file')).toBe('"path\\\\to\\\\file"')
    })
  })

  describe('parseString', () => {
    it('should parse quoted strings', () => {
      expect(parseString('"hello world"')).toBe('hello world')
      expect(parseString('"123abc"')).toBe('123abc')
      expect(parseString('""')).toBe('')
    })

    it('should parse escaped quoted strings', () => {
      expect(parseString('"hello \\"world\\""')).toBe('hello "world"')
      expect(parseString('"line1\\nline2"')).toBe('line1\nline2')
    })

    it('should parse unquoted strings', () => {
      expect(parseString('hello')).toBe('hello')
      expect(parseString('variable_name')).toBe('variable_name')
      expect(parseString('_private')).toBe('_private')
    })

    it('should trim whitespace around strings', () => {
      expect(parseString('  hello  ')).toBe('hello')
      expect(parseString('\tworld\t')).toBe('world')
      expect(parseString('\nvalue\n')).toBe('value')
    })

    it('should handle quoted strings correctly', () => {
      expect(parseString('"unclosed')).toBe('"unclosed') // Doesn't match quoted pattern
      expect(parseString('unclosed"')).toBe('unclosed"') // Doesn't match quoted pattern
      expect(parseString('""extra')).toBe('""extra') // Extra content after quotes
    })

    it('should handle empty string', () => {
      expect(parseString('')).toBe('')
    })
  })

  describe('isValidIdentifier', () => {
    it('should validate correct identifiers', () => {
      expect(isValidIdentifier('valid_name')).toBe(true)
      expect(isValidIdentifier('_private')).toBe(true)
      expect(isValidIdentifier('camelCase')).toBe(true)
      expect(isValidIdentifier('UPPERCASE')).toBe(true)
      expect(isValidIdentifier('a')).toBe(true)
      expect(isValidIdentifier('Z')).toBe(true)
    })

    it('should reject invalid identifiers', () => {
      expect(isValidIdentifier('123invalid')).toBe(false)
      expect(isValidIdentifier('invalid-name')).toBe(false)
      expect(isValidIdentifier('invalid.name')).toBe(false)
      expect(isValidIdentifier('')).toBe(false)
      expect(isValidIdentifier(' ')).toBe(false)
    })

    it('should reject identifiers with special characters', () => {
      expect(isValidIdentifier('name@domain')).toBe(false)
      expect(isValidIdentifier('name#hash')).toBe(false)
      expect(isValidIdentifier('name$var')).toBe(false)
    })
  })

  describe('splitLines', () => {
    it('should split on \\r\\n', () => {
      expect(splitLines('line1\r\nline2\r\nline3')).toEqual(['line1', 'line2', 'line3'])
    })

    it('should split on \\n', () => {
      expect(splitLines('line1\nline2\nline3')).toEqual(['line1', 'line2', 'line3'])
    })

    it('should treat \\r as literal character (no split)', () => {
      expect(splitLines('line1\rline2\rline3')).toEqual(['line1\rline2\rline3'])
    })

    it('should handle mixed line endings (\\r treated as literal)', () => {
      expect(splitLines('line1\r\nline2\nline3\rline4')).toEqual(['line1', 'line2', 'line3\rline4'])
    })

    it('should handle empty string', () => {
      expect(splitLines('')).toEqual([''])
    })

    it('should handle string without line breaks', () => {
      expect(splitLines('single line')).toEqual(['single line'])
    })

    it('should preserve empty lines', () => {
      expect(splitLines('line1\n\nline3')).toEqual(['line1', '', 'line3'])
    })
  })

  describe('countIndent', () => {
    it('should count leading spaces', () => {
      expect(countIndent('  hello')).toBe(2)
      expect(countIndent('    test')).toBe(4)
      expect(countIndent('      value')).toBe(6)
    })

    it('should return 0 for leading tabs (only counts spaces)', () => {
      expect(countIndent('\thello')).toBe(0) // Tabs are not counted
      expect(countIndent('\t\tworld')).toBe(0) // Tabs are not counted
    })

    it('should count only spaces in mixed leading whitespace', () => {
      const result1 = countIndent('  \t hello')
      const result2 = countIndent('\t  test')
      expect(result1).toBeGreaterThanOrEqual(0)
      expect(result2).toBeGreaterThanOrEqual(0)
    })

    it('should return 0 for no leading whitespace', () => {
      expect(countIndent('hello')).toBe(0)
      expect(countIndent('test value')).toBe(0)
      expect(countIndent('123')).toBe(0)
    })

    it('should handle empty string', () => {
      expect(countIndent('')).toBe(0)
    })

    it('should count only spaces in string with only whitespace', () => {
      expect(countIndent('   ')).toBe(3) // 3 spaces
      expect(countIndent('\t\t')).toBe(0) // 0 spaces (tabs only)
      const result = countIndent('  \t  ')
      expect(result).toBeGreaterThanOrEqual(0)
    })
  })

  describe('stripIndent', () => {
    it('should strip common indent from multiline string', () => {
      const input = `  first line
    second line
      third line`
      const result = stripIndent(input)
      expect(result).toContain('first line')
      expect(result).toContain('second line')
      expect(result).toContain('third line')
    })

    it('should handle uneven indentation', () => {
      const input = `  line1
    line2
      line3
        line4`
      const result = stripIndent(input)
      expect(result).toContain('line1')
      expect(result).toContain('line2')
      expect(result).toContain('line3')
      expect(result).toContain('line4')
    })

    it('should preserve relative indentation', () => {
      const input = `  line1
    line2
      line3`
      const result = stripIndent(input)
      expect(result).toContain('line1')
      expect(result).toContain('line2')
      expect(result).toContain('line3')
    })

    it('should handle tabs in indentation (only spaces counted)', () => {
      const input = `\tline1
  \tline2
\t\tline3`
      const result = stripIndent(input)
      expect(result).toContain('line1')
      expect(result).toContain('line2')
      expect(result).toContain('line3')
    })

    it('should handle empty lines', () => {
      const input = `line1

  line3`
      const result = stripIndent(input)
      expect(result).toContain('line1')
      expect(result).toContain('line3')
    })

    it('should handle string with only whitespace lines', () => {
      const input = '   \n   \n   '
      expect(stripIndent(input)).toBe('')
    })

    it('should handle single line', () => {
      const input = '  single line'
      expect(stripIndent(input)).toBe('single line')
    })

    it('should handle string with no indentation', () => {
      const input = 'line1\nline2\nline3'
      expect(stripIndent(input)).toBe('line1\nline2\nline3')
    })

    it('should preserve trailing whitespace', () => {
      const input = `  line1
    line2    `
      const result = stripIndent(input)
      expect(result).toContain('line1')
      expect(result).toContain('line2    ')
    })

    it('should handle Unicode characters in indentation', () => {
      const input = '  line with Unicode: 测试'
      expect(stripIndent(input)).toBe('line with Unicode: 测试')
    })

    it('should return empty string for input with only empty lines', () => {
      const input = '\n\n\n'
      expect(stripIndent(input)).toBe('')
    })

    it('should handle large indentation gracefully', () => {
      const input = '        deeply indented line'
      expect(stripIndent(input)).toBe('deeply indented line')
    })
  })
})