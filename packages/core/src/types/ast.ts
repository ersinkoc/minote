/**
 * MINOTE Abstract Syntax Tree types
 */

export type MinoteValue =
  | string
  | number
  | boolean
  | null
  | MinoteObject
  | MinoteArray
  | MinoteTable

export interface MinoteNode {
  type: string
  loc?: SourceLocation
}

export interface MinoteDocument extends MinoteNode {
  type: 'Document'
  body: MinoteObject
}

export interface MinoteObject extends MinoteNode {
  type: 'Object'
  properties: MinoteProperty[]
}

export interface MinoteProperty extends MinoteNode {
  type: 'Property'
  key: string
  value: MinoteValue
  typeAnnotation?: TypeAnnotation
  inline?: boolean
}

export interface MinoteArray extends MinoteNode {
  type: 'Array'
  elements: MinoteValue[]
  typeAnnotation?: TypeAnnotation
  style: 'inline' | 'multiline' | 'table'
}

export interface MinoteTable extends MinoteNode {
  type: 'Table'
  schema: SchemaDefinition
  rows: MinoteTableRow[]
}

export interface MinoteTableRow extends MinoteNode {
  type: 'TableRow'
  cells: MinoteValue[]
}

export interface SchemaDefinition extends MinoteNode {
  type: 'Schema'
  name: string
  fields: SchemaField[]
}

export interface SchemaField {
  name: string
  type: TypeAnnotation
  optional?: boolean
}

/**
 * Type system
 */
export type PrimitiveType =
  | 'str'
  | 's'
  | 'int'
  | 'i'
  | 'i32'
  | 'i64'
  | 'float'
  | 'f'
  | 'f32'
  | 'f64'
  | 'bool'
  | 'b'
  | 'null'

export type TypeAnnotation = PrimitiveType | ArrayType | ObjectType

export interface ArrayType {
  kind: 'array'
  elementType: TypeAnnotation
}

export interface ObjectType {
  kind: 'object'
  fields: SchemaField[]
}

/**
 * Source location for error reporting
 */
export interface SourceLocation {
  start: Position
  end: Position
  source?: string
}

export interface Position {
  line: number
  column: number
  offset: number
}

/**
 * Type guards
 */
export function isMinoteObject(value: MinoteValue): value is MinoteObject {
  return typeof value === 'object' && value !== null && 'type' in value && value.type === 'Object'
}

export function isMinoteArray(value: MinoteValue): value is MinoteArray {
  return typeof value === 'object' && value !== null && 'type' in value && value.type === 'Array'
}

export function isMinoteTable(value: MinoteValue): value is MinoteTable {
  return typeof value === 'object' && value !== null && 'type' in value && value.type === 'Table'
}

export function isPrimitive(value: MinoteValue): value is string | number | boolean | null {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  )
}
