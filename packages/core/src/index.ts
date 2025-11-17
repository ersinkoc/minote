/**
 * MINOTE - Minimal Notation for LLMs
 * Core library for parsing, serializing, and converting MINOTE format
 */

// Types
export * from './types'

// Errors
export * from './errors'

// Parser
export { MinoteParser } from './parser/parser'
export { Tokenizer, TokenType, type Token } from './parser/tokenizer'

// Serializer
export { MinoteStringifier } from './serializer/stringifier'
export { MinoteFormatter } from './serializer/formatter'

// Converters
export { JsonToMinoteConverter } from './converter/json-to-minote'
export { MinoteToJsonConverter, type MinoteToJsonOptions } from './converter/minote-to-json'
export { MinoteOptimizer, type OptimizationStats } from './converter/optimizer'

// Validators
export { SchemaValidator } from './validator/schema-validator'
export { TypeChecker } from './validator/type-checker'

// Utilities (selective exports)
export {
  inferType,
  isTableCandidate,
  extractSchema,
  parseTypeAnnotation,
  formatTypeAnnotation,
} from './utils/type-inference'
export { needsQuotes, escapeString, unescapeString, formatString } from './utils/string-utils'
export { estimateTokens, calculateReduction } from './utils/helpers'
export {
  isSafeRegex,
  safeRegexTest,
  safeRegexReplace,
  SAFE_PATTERNS,
  type RegexSafetyOptions,
} from './utils/regex-safety'

// Convenience functions
export { parse, stringify, toMinote, toJson, format } from './convenience'
