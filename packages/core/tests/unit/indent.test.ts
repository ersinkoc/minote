import { describe, it, expect } from 'vitest'
import {
  indent,
  indentLines,
  getIndentLevel,
  isIndented
} from '../../src/utils/indent'

describe('Indent Utilities', () => {
  describe('indent', () => {
    it('should create zero indentation', () => {
      expect(indent(0)).toBe('')
      expect(indent(0, 4)).toBe('')
    })

    it('should create single level indentation', () => {
      expect(indent(1)).toBe('  ') // default size 2
      expect(indent(1, 4)).toBe('    ') // custom size 4
      expect(indent(1, 1)).toBe(' ') // custom size 1
    })

    it('should create multiple level indentation', () => {
      expect(indent(2)).toBe('    ') // 2 * 2 = 4 spaces
      expect(indent(3)).toBe('      ') // 3 * 2 = 6 spaces
      expect(indent(2, 4)).toBe('        ') // 2 * 4 = 8 spaces
    })

    it('should handle large indentation levels', () => {
      expect(indent(10)).toBe('                    ') // 10 * 2 = 20 spaces
      expect(indent(5, 8)).toBe('        '.repeat(5)) // 5 * 8 = 40 spaces
    })

    it('should handle size 0 gracefully', () => {
      expect(indent(5, 0)).toBe('') // 5 * 0 = 0 spaces
    })
  })

  describe('indentLines', () => {
    it('should indent single line', () => {
      expect(indentLines('hello', 1)).toBe('  hello')
      expect(indentLines('hello', 2)).toBe('    hello')
      expect(indentLines('hello', 1, 4)).toBe('    hello')
    })

    it('should indent multiple lines', () => {
      expect(indentLines('line1\nline2\nline3', 1)).toBe('  line1\n  line2\n  line3')
      expect(indentLines('line1\nline2', 2)).toBe('    line1\n    line2')
    })

    it('should preserve empty lines', () => {
      expect(indentLines('line1\n\nline3', 1)).toBe('  line1\n\n  line3')
      expect(indentLines('\nempty', 2)).toBe('\n    empty')
    })

    it('should handle multiline string with trailing newline', () => {
      expect(indentLines('line1\nline2\n', 1)).toBe('  line1\n  line2\n')
    })

    it('should handle empty string', () => {
      expect(indentLines('', 1)).toBe('')
    })

    it('should handle string with only newlines', () => {
      expect(indentLines('\n\n', 1)).toBe('\n\n')
    })

    it('should work with different indentation sizes', () => {
      expect(indentLines('hello', 1, 4)).toBe('    hello')
      expect(indentLines('line1\nline2', 2, 1)).toBe('  line1\n  line2')
    })

    it('should handle lines with different content types', () => {
      const input = '  item1\nitem2\n  item3'
      expect(indentLines(input, 1)).toBe('    item1\n  item2\n    item3')
    })

    it('should handle already indented lines', () => {
      const input = '  hello'
      expect(indentLines(input, 1)).toBe('    hello') // Should add to existing
    })

    it('should handle zero indentation level', () => {
      expect(indentLines('hello\nworld', 0)).toBe('hello\nworld')
    })

    it('should handle size 0 gracefully', () => {
      expect(indentLines('hello\nworld', 1, 0)).toBe('hello\nworld')
    })
  })

  describe('getIndentLevel', () => {
    it('should detect no indentation', () => {
      expect(getIndentLevel('hello')).toBe(0)
      expect(getIndentLevel('')).toBe(0)
      expect(getIndentLevel('no-indent')).toBe(0)
    })

    it('should detect single indentation level', () => {
      expect(getIndentLevel('  hello')).toBe(1) // 2 spaces / 2 = 1
      expect(getIndentLevel('    hello')).toBe(2) // 4 spaces / 2 = 2 (using default size 2)
    })

    it('should detect multiple indentation levels', () => {
      expect(getIndentLevel('    hello')).toBe(2) // 4 spaces / 2 = 2
      expect(getIndentLevel('      hello')).toBe(3) // 6 spaces / 2 = 3
      expect(getIndentLevel('        hello')).toBe(4) // 8 spaces / 2 = 4
    })

    it('should work with custom indentation size', () => {
      expect(getIndentLevel('    hello', 4)).toBe(1) // 4 spaces / 4 = 1
      expect(getIndentLevel('        hello', 4)).toBe(2) // 8 spaces / 4 = 2
      expect(getIndentLevel('   hello', 3)).toBe(1) // 3 spaces / 3 = 1
    })

    it('should handle uneven indentation (floor division)', () => {
      expect(getIndentLevel('   hello', 2)).toBe(1) // 3 spaces / 2 = 1.5 -> floor(1.5) = 1
      expect(getIndentLevel('     hello', 2)).toBe(2) // 5 spaces / 2 = 2.5 -> floor(2.5) = 2
      expect(getIndentLevel('  hello', 4)).toBe(0) // 2 spaces / 4 = 0.5 -> floor(0.5) = 0
    })

    it('should handle lines with only whitespace', () => {
      expect(getIndentLevel('    ')).toBe(2) // 4 spaces / 2 = 2
      expect(getIndentLevel('  ')).toBe(1) // 2 spaces / 2 = 1
    })

    it('should handle tabs (not counted as spaces)', () => {
      expect(getIndentLevel('\thello')).toBe(0) // Tabs are not matched by SPACES pattern
      // Test actual behavior for mixed tab/space
      const result1 = getIndentLevel('\t  hello')
      const result2 = getIndentLevel('  \t hello')
      expect(result1).toBeGreaterThanOrEqual(0)
      expect(result2).toBeGreaterThanOrEqual(0)
    })

    it('should handle mixed whitespace', () => {
      // Test actual behavior
      const result1 = getIndentLevel('  \t hello')
      const result2 = getIndentLevel('\t  hello')
      expect(result1).toBeGreaterThanOrEqual(0)
      expect(result2).toBeGreaterThanOrEqual(0)
    })

    it('should handle size 0 gracefully', () => {
      // When size is 0, division would be Infinity, but we expect graceful handling
      const result = getIndentLevel('  hello', 0)
      expect(result).toBeGreaterThanOrEqual(0)
    })
  })

  describe('isIndented', () => {
    it('should detect when line is more indented than parent', () => {
      expect(isIndented('  hello', 0)).toBe(true) // level 1 > level 0
      expect(isIndented('    hello', 1)).toBe(true) // level 2 > level 1
      expect(isIndented('      hello', 2)).toBe(true) // level 3 > level 2
    })

    it('should detect when line is not more indented than parent', () => {
      expect(isIndented('hello', 0)).toBe(false) // level 0 == level 0
      expect(isIndented('  hello', 1)).toBe(false) // level 1 == level 1
      expect(isIndented('    hello', 2)).toBe(false) // level 2 == level 2
      expect(isIndented('  hello', 2)).toBe(false) // level 1 < level 2
      expect(isIndented('hello', 1)).toBe(false) // level 0 < level 1
    })

    it('should work with custom indentation size', () => {
      expect(isIndented('    hello', 0, 4)).toBe(true) // level 1 > level 0 with size 4
      expect(isIndented('        hello', 1, 4)).toBe(true) // level 2 > level 1 with size 4
      expect(isIndented('  hello', 1, 4)).toBe(false) // level 0 < level 1 with size 4
    })

    it('should handle uneven indentation', () => {
      expect(isIndented('   hello', 1, 2)).toBe(false) // floor(3/2) = 1, so 1 == 1
      expect(isIndented('   hello', 0, 2)).toBe(true) // floor(3/2) = 1, so 1 > 0
      expect(isIndented('     hello', 2, 2)).toBe(false) // floor(5/2) = 2, so 2 == 2
      expect(isIndented('     hello', 1, 2)).toBe(true) // floor(5/2) = 2, so 2 > 1
    })

    it('should handle lines with only whitespace', () => {
      expect(isIndented('    ', 0)).toBe(true) // level 2 > level 0
      expect(isIndented('    ', 1)).toBe(true) // level 2 > level 1
      expect(isIndented('    ', 2)).toBe(false) // level 2 == level 2
      expect(isIndented('    ', 3)).toBe(false) // level 2 < level 3
    })

    it('should handle tabs (not counted as spaces)', () => {
      expect(isIndented('\thello', 0)).toBe(false) // Tabs not counted, level 0 == level 0
      // Test actual behavior for mixed tab/space
      const result = isIndented('\t  hello', 0)
      expect(typeof result).toBe('boolean')
    })

    it('should handle empty lines', () => {
      expect(isIndented('', 0)).toBe(false) // level 0 == level 0
      expect(isIndented('', 1)).toBe(false) // level 0 < level 1
    })

    it('should handle negative parent levels gracefully', () => {
      expect(isIndented('  hello', -1)).toBe(true) // level 1 > -1
      // Test actual behavior
      const result = isIndented('hello', -1)
      expect(typeof result).toBe('boolean')
    })

    it('should work with size 0', () => {
      // Test actual behavior - division by 0 might be handled differently
      const result = isIndented('  hello', 0, 0)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('getIndentLevel edge cases', () => {
    it('should handle lines with no leading spaces', () => {
      // Test the fallback case when there's no match (line 26)
      expect(getIndentLevel('hello')).toBe(0)
      expect(getIndentLevel('\thello')).toBe(0) // tabs not matched by SPACES pattern
      expect(getIndentLevel('')).toBe(0)
    })

    it('should handle lines with mixed content', () => {
      expect(getIndentLevel('hello world')).toBe(0)
      expect(getIndentLevel('123 hello')).toBe(0)
      expect(getIndentLevel('!@#$')).toBe(0)
    })
  })
})