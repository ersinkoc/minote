import { SAFE_PATTERNS } from './regex-safety'

/**
 * Check if a string needs quotes in MINOTE format
 */
export function needsQuotes(str: string): boolean {
  // Empty string needs quotes
  if (str.length === 0) {
    return true
  }

  // Contains special characters or whitespace
  if (/[\s,:|[\]{}#@!~"\\]/.test(str)) {
    return true
  }

  // Starts with a number
  if (/^\d/.test(str)) {
    return true
  }

  // Looks like a boolean
  if (str === 'true' || str === 'false') {
    return true
  }

  // Looks like null
  if (str === 'null') {
    return true
  }

  return false
}

/**
 * Escape special characters in a string
 */
export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

/**
 * Unescape special characters in a string
 */
export function unescapeString(str: string): string {
  return str
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
}

/**
 * Format a string for MINOTE output
 */
export function formatString(str: string): string {
  if (needsQuotes(str)) {
    return `"${escapeString(str)}"`
  }
  return str
}

/**
 * Parse a quoted or unquoted string
 */
export function parseString(str: string): string {
  const trimmed = str.trim()

  // Quoted string
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return unescapeString(trimmed.slice(1, -1))
  }

  // Unquoted string
  return trimmed
}

/**
 * Check if a string is a valid identifier (for keys)
 */
export function isValidIdentifier(str: string): boolean {
  return SAFE_PATTERNS.IDENTIFIER.test(str)
}

/**
 * Split a string into lines, preserving line endings
 */
export function splitLines(str: string): string[] {
  return str.split(SAFE_PATTERNS.NEWLINE_SPLIT)
}

/**
 * Count leading whitespace
 */
export function countIndent(line: string): number {
  const match = line.match(SAFE_PATTERNS.SPACES)
  return match ? match[1].length : 0
}

/**
 * Strip common indent from multiline string
 */
export function stripIndent(str: string): string {
  const lines = splitLines(str)
  const nonEmptyLines = lines.filter(l => l.trim().length > 0)

  if (nonEmptyLines.length === 0) {
    return ''
  }

  const minIndent = Math.min(...nonEmptyLines.map(countIndent))

  return lines.map(line => line.slice(minIndent)).join('\n')
}
