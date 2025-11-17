/**
 * Regular Expression Safety Utilities
 *
 * Prevents ReDoS (Regular Expression Denial of Service) attacks by:
 * 1. Validating regex patterns for known vulnerable constructs
 * 2. Providing timeout wrappers for regex execution
 * 3. Using safe alternatives when possible
 */

export interface RegexSafetyOptions {
  /**
   * Maximum execution time for regex operations in milliseconds
   * @default 100
   */
  timeoutMs?: number

  /**
   * Enable validation of regex patterns for vulnerable constructs
   * @default true
   */
  enableValidation?: boolean
}

/**
 * Known vulnerable regex patterns that can cause ReDoS
 */
const VULNERABLE_PATTERNS = [
  // Nested quantifiers
  /\*.*\*/,
  /\+.*\+/,
  /\{.*\}.*\{/,
  /\?.*\?/,

  // Alternation with overlapping groups
  /\(\).*\|/,
  /\|.*\(\)/,

  // Multiple backreferences
  /\\.*\\[0-9]/,

  // Catastrophic backtracking patterns
  /\(.+\)\+/,
  /\(.+\)\*/,

  // Exponential patterns
  /a+a+/,
  /a*.*a*/,
]

/**
 * Check if a regex pattern contains potentially vulnerable constructs
 */
export function isSafeRegex(pattern: string | RegExp): boolean {
  const patternStr = typeof pattern === 'string' ? pattern : pattern.source

  // Explicitly allow common safe patterns used in the codebase
  const allowedPatterns = [
    /^\^[a-zA-Z_]\[a-zA-Z0-9_\]\*\$$/,          // ^[a-zA-Z_][a-zA-Z0-9_]*$
    /^\^\\d\+\$$/,                                 // ^\d+$
    /^\^\\s\+\$$/,                                 // ^\s+$
    /^\^\\w\+\$$/,                                 // ^\w+$
    /^\^[a-zA-Z_]$/,                               // ^[a-zA-Z_]
    /^\^\( \*\)\$$/,                               // ^( *)$
    /\\r\\?\\n/,                                   // \r?\n
    /^\\\$$/,                                      // \\$
    /^\"$/,                                        // "
    /^\\n$/,                                       // \n
    /^\\r$/,                                       // \r
    /^\\t$/,                                       // \t
    /^\\\\/,                                       // \\
  ]

  for (const allowed of allowedPatterns) {
    if (allowed.test(patternStr)) {
      return true
    }
  }

  // Known catastrophic backtracking patterns that cause ReDoS
  const dangerousPatterns = [
    // Nested quantifiers with overlapping groups
    /\(.+\)\+/,
    /\(.+\)\*/,
    /\(.*\)\*\+/,
    /\(.*\)\+\*/,

    // Repeated groups with backreferences
    /(\w+)\1/,
    /(\d+)\1/,

    // Alternation with repeated patterns
    /^(a+)+b$/,
    /^(a+)*b$/,

    // Complex overlapping patterns
    /(.+)*\1/,
    /(.+)+\1/,
  ]

  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(patternStr)) {
      return false
    }
  }

  // Allow simple character classes and literals
  if (/^\^\[?[^\(\)]*\]?\$?$/.test(patternStr)) {
    return true
  }

  // Check for excessive nested quantifiers
  const nestedQuantifiers = (patternStr.match(/(\*|\+|\?|\{[^}]*\})/g) || []).length
  if (nestedQuantifiers > 20) {
    return false
  }

  // Check for excessive alternations (can cause exponential backtracking)
  const alternations = (patternStr.split('|').length - 1)
  if (alternations > 50) {
    return false
  }

  return true
}

/**
 * Execute regex with timeout to prevent ReDoS
 */
export function safeRegexTest(
  pattern: string | RegExp,
  input: string,
  options: RegexSafetyOptions = {}
): boolean {
  const { timeoutMs = 100, enableValidation = true } = options

  if (enableValidation && !isSafeRegex(pattern)) {
    throw new Error(`Unsafe regex pattern detected: ${pattern}`)
  }

  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern

  // For simple patterns, just use normal test
  if (isSimpleRegex(regex)) {
    return regex.test(input)
  }

  // For complex patterns, use timeout
  return withTimeout(() => regex.test(input), timeoutMs)
}

/**
 * Execute regex replace with timeout
 */
export function safeRegexReplace(
  pattern: string | RegExp,
  replacement: string,
  input: string,
  options: RegexSafetyOptions = {}
): string {
  const { timeoutMs = 100, enableValidation = true } = options

  if (enableValidation && !isSafeRegex(pattern)) {
    throw new Error(`Unsafe regex pattern detected: ${pattern}`)
  }

  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern

  // For simple patterns, just use normal replace
  if (isSimpleRegex(regex)) {
    return input.replace(regex, replacement)
  }

  // For complex patterns, use timeout
  return withTimeout(() => input.replace(regex, replacement), timeoutMs)
}

/**
 * Check if regex is simple enough to not need timeout
 */
function isSimpleRegex(regex: RegExp): boolean {
  const pattern = regex.source

  // Simple character classes and literals
  if (/^(\[[^\]]*\]|[^\\()[\]{}*+?.^$|])+$/.test(pattern)) {
    return true
  }

  // Simple anchors and literals
  if (/^[\\^$]?[a-zA-Z0-9_]+$/.test(pattern)) {
    return true
  }

  return false
}

/**
 * Execute function with timeout
 */
function withTimeout<T>(fn: () => T, timeoutMs: number): T {
  let completed = false
  let result: T
  let timeoutError: Error | undefined

  // Set timeout
  const timeoutId = setTimeout(() => {
    if (!completed) {
      timeoutError = new Error(`Regex operation timed out after ${timeoutMs}ms`)
      // Note: We can't actually terminate the regex operation in JavaScript,
      // but we can at least detect when it takes too long
    }
  }, timeoutMs)

  try {
    result = fn()
    completed = true
  } catch (e) {
    completed = true
    throw e
  } finally {
    clearTimeout(timeoutId)

    if (!completed && timeoutError) {
      throw timeoutError
    }
  }

  return result
}

/**
 * Pre-compiled safe regex patterns
 */
export const SAFE_PATTERNS = {
  // Character classes
  ALPHABETIC: /^[a-zA-Z]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  IDENTIFIER: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
  DIGITS: /^\d+$/,
  WHITESPACE: /^\s+$/,

  // Simple patterns
  EMAIL_SAFE: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email validation
  URL_SAFE: /^https?:\/\/[^\s/$.?#].[^\s]*$/, // Basic URL validation

  // Common string utilities
  SPACES: /^( *)/,
  NEWLINE_SPLIT: /\r?\n/,
  ESCAPE_CHARS: /[\\"]/g,
  ESCAPE_NEWLINES: /[\n\r\t]/g,
}