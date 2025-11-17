import { PrimitiveType, TypeAnnotation, SchemaField } from '../types/ast'

/**
 * Infer the type of a JavaScript value
 */
export function inferType(value: unknown): PrimitiveType {
  if (value === null) {
    return 'null'
  }

  switch (typeof value) {
    case 'string':
      return 's'
    case 'number':
      return Number.isInteger(value) ? 'i' : 'f'
    case 'boolean':
      return 'b'
    default:
      return 's' // fallback to string
  }
}

/**
 * Check if an array is a candidate for table format
 * (all elements are objects with the same keys)
 */
export function isTableCandidate(arr: unknown[]): boolean {
  if (arr.length === 0) {
    return false
  }

  // All elements must be plain objects
  if (!arr.every(item => isPlainObject(item))) {
    return false
  }

  // Get keys from first object
  const firstKeys = Object.keys(arr[0] as Record<string, unknown>).sort()

  // Check if all objects have the same keys
  return arr.every(item => {
    const keys = Object.keys(item as Record<string, unknown>).sort()
    return (
      keys.length === firstKeys.length && keys.every((key, i) => key === firstKeys[i])
    )
  })
}

/**
 * Extract schema from an array of uniform objects
 */
export function extractSchema(
  arr: Record<string, unknown>[],
  name = 'Row'
): { name: string; fields: SchemaField[] } {
  if (arr.length === 0) {
    return { name, fields: [] }
  }

  const firstObj = arr[0]
  const fields: SchemaField[] = Object.keys(firstObj).map(key => ({
    name: key,
    type: inferType(firstObj[key]),
  }))

  return { name, fields }
}

/**
 * Check if value is a plain object (not array, not null)
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

/**
 * Parse type annotation string (e.g., "@i32", "@f", "@s[]")
 */
export function parseTypeAnnotation(annotation: string): TypeAnnotation {
  // Remove @ prefix
  const typeStr = annotation.startsWith('@') ? annotation.slice(1) : annotation

  // Check for array type
  if (typeStr.endsWith('[]')) {
    const elementType = typeStr.slice(0, -2) as PrimitiveType
    return {
      kind: 'array',
      elementType,
    }
  }

  // Primitive type
  return typeStr as PrimitiveType
}

/**
 * Format type annotation for output
 */
export function formatTypeAnnotation(type: TypeAnnotation): string {
  if (typeof type === 'string') {
    return `@${type}`
  }

  if (type.kind === 'array') {
    const elementType = typeof type.elementType === 'string' ? type.elementType : 's'
    return `@${elementType}[]`
  }

  // Object type - simplified
  return '@obj'
}

/**
 * Check if a type annotation matches a value
 */
export function typeMatches(type: TypeAnnotation, value: unknown): boolean {
  if (typeof type === 'string') {
    const inferredType = inferType(value)
    return normalizeType(type) === normalizeType(inferredType)
  }

  if (type.kind === 'array') {
    if (!Array.isArray(value)) {
      return false
    }
    // Check first element (simplified)
    if (value.length > 0) {
      return typeMatches(type.elementType, value[0])
    }
    return true
  }

  return false
}

/**
 * Normalize type names (e.g., "i" -> "i32", "f" -> "f64")
 */
function normalizeType(type: PrimitiveType): string {
  const typeMap: Record<string, string> = {
    s: 'str',
    str: 'str',
    i: 'i32',
    int: 'i32',
    i32: 'i32',
    i64: 'i64',
    f: 'f64',
    float: 'f64',
    f32: 'f32',
    f64: 'f64',
    b: 'bool',
    bool: 'bool',
    null: 'null',
  }
  return typeMap[type] || type
}
