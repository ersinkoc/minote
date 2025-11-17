import { SAFE_PATTERNS } from './regex-safety'

/**
 * Create an indentation string
 */
export function indent(level: number, size = 2): string {
  return ' '.repeat(level * size)
}

/**
 * Add indentation to each line of a string
 */
export function indentLines(str: string, level: number, size = 2): string {
  const indentation = indent(level, size)
  return str
    .split('\n')
    .map(line => (line.length > 0 ? indentation + line : line))
    .join('\n')
}

/**
 * Get indentation level from a line
 */
export function getIndentLevel(line: string, size = 2): number {
  const match = line.match(SAFE_PATTERNS.SPACES)
  if (!match) return 0
  return Math.floor(match[1].length / size)
}

/**
 * Check if line is indented more than parent
 */
export function isIndented(line: string, parentLevel: number, size = 2): boolean {
  return getIndentLevel(line, size) > parentLevel
}
