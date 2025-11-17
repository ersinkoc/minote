import { MinoteValue, MinoteObject, MinoteArray, MinoteTable } from '../types/ast'
import { isTableCandidate, extractSchema } from '../utils/type-inference'

export interface OptimizationStats {
  tablesDetected: number
  arraysOptimized: number
  objectsInlined: number
}

/**
 * Optimize MINOTE AST for minimal token usage
 */
export class MinoteOptimizer {
  private stats: OptimizationStats = {
    tablesDetected: 0,
    arraysOptimized: 0,
    objectsInlined: 0,
  }

  /**
   * Optimize MINOTE value
   */
  optimize(value: MinoteValue, minTableRows = 3): MinoteValue {
    this.stats = {
      tablesDetected: 0,
      arraysOptimized: 0,
      objectsInlined: 0,
    }

    return this.optimizeValue(value, minTableRows)
  }

  /**
   * Get optimization statistics
   */
  getStats(): OptimizationStats {
    return { ...this.stats }
  }

  private optimizeValue(value: MinoteValue, minTableRows: number): MinoteValue {
    if (value === null || typeof value !== 'object') {
      return value
    }

    if ('type' in value) {
      if (value.type === 'Object') {
        return this.optimizeObject(value as MinoteObject, minTableRows)
      }

      if (value.type === 'Array') {
        return this.optimizeArray(value as MinoteArray, minTableRows)
      }

      if (value.type === 'Table') {
        return value // Tables are already optimized
      }
    }

    return value
  }

  private optimizeObject(obj: MinoteObject, minTableRows: number): MinoteObject {
    const properties = obj.properties.map(prop => ({
      ...prop,
      value: this.optimizeValue(prop.value, minTableRows),
    }))

    return {
      ...obj,
      properties,
    }
  }

  private optimizeArray(arr: MinoteArray, minTableRows: number): MinoteArray | MinoteTable {
    // Try to convert to table if beneficial
    if (arr.elements.length >= minTableRows) {
      const plainElements = arr.elements.map(el => {
        if (typeof el === 'object' && el !== null && 'type' in el && el.type === 'Object') {
          const obj: Record<string, unknown> = {}
          for (const prop of (el as MinoteObject).properties) {
            obj[prop.key] = prop.value
          }
          return obj
        }
        return null
      })

      if (plainElements.every(el => el !== null) && isTableCandidate(plainElements as Record<string, unknown>[])) {
        this.stats.tablesDetected++
        const { name, fields } = extractSchema(plainElements as Record<string, unknown>[])

        return {
          type: 'Table',
          schema: {
            type: 'Schema',
            name,
            fields,
          },
          rows: (plainElements as Record<string, unknown>[]).map(obj => ({
            type: 'TableRow',
            cells: fields.map(field => obj[field.name] as MinoteValue),
          })),
        }
      }
    }

    // Optimize array elements
    const elements = arr.elements.map(el => this.optimizeValue(el, minTableRows))

    return {
      ...arr,
      elements,
    }
  }
}
