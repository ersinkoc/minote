/**
 * Convenience functions for common MINOTE operations
 */

import { MinoteParser } from './parser/parser'
import { MinoteStringifier } from './serializer/stringifier'
import { MinoteFormatter } from './serializer/formatter'
import { JsonToMinoteConverter } from './converter/json-to-minote'
import { MinoteToJsonConverter } from './converter/minote-to-json'
import { MinoteDocument, MinoteValue } from './types/ast'
import { ParserOptions, SerializerOptions, JsonConversionOptions } from './types/options'

/**
 * Parse MINOTE string to AST
 */
export function parse(input: string, options?: ParserOptions): MinoteDocument {
  const parser = new MinoteParser(options)
  return parser.parse(input)
}

/**
 * Stringify MINOTE AST to string
 */
export function stringify(value: MinoteValue, options?: SerializerOptions): string {
  const stringifier = new MinoteStringifier(options)
  return stringifier.stringify(value)
}

/**
 * Convert JSON to MINOTE
 */
export function toMinote(json: string | object, options?: JsonConversionOptions): string {
  const converter = new JsonToMinoteConverter(options)
  return converter.convert(json)
}

/**
 * Convert MINOTE to JSON
 */
export function toJson(minote: string, pretty = true): string {
  const converter = new MinoteToJsonConverter({ pretty })
  return converter.convert(minote)
}

/**
 * Format/prettify MINOTE text
 */
export function format(minote: string, options?: SerializerOptions): string {
  const formatter = new MinoteFormatter(options)
  return formatter.format(minote)
}
