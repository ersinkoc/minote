import { MinoteValue, TypeAnnotation } from '../types/ast'
import { typeMatches } from '../utils/type-inference'

export class TypeChecker {
  /**
   * Check if value matches type annotation
   */
  check(value: MinoteValue, type: TypeAnnotation): boolean {
    return typeMatches(type, value)
  }

  /**
   * Coerce value to match type if possible
   */
  coerce(value: MinoteValue, type: TypeAnnotation): MinoteValue {
    // Basic coercion stub
    if (typeof type === 'string') {
      if (type === 'i' || type === 'int' || type === 'i32' || type === 'i64') {
        if (typeof value === 'string') {
          const parsed = parseInt(value, 10)
          if (!isNaN(parsed)) {
            return parsed
          }
        }
      }

      if (type === 'f' || type === 'float' || type === 'f32' || type === 'f64') {
        if (typeof value === 'string') {
          const parsed = parseFloat(value)
          if (!isNaN(parsed)) {
            return parsed
          }
        }
      }

      if (type === 'b' || type === 'bool') {
        if (typeof value === 'string') {
          if (value === 'true') return true
          if (value === 'false') return false
        }
      }
    }

    return value
  }
}
