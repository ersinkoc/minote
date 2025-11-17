/**
 * Example: E-commerce API Response
 *
 * Shows how MINOTE can represent complex e-commerce data
 * with significant token savings compared to JSON.
 */

import { toMinote, toJson } from 'minote'

// Typical e-commerce API response
const apiResponse = {
  status: 'success',
  timestamp: 1700000000,
  data: {
    order: {
      id: 'ORD-2025-001',
      customer: {
        id: 'CUST-789',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        tier: 'premium'
      },
      items: [
        {
          sku: 'LAPTOP-X1',
          name: 'UltraBook Pro',
          quantity: 1,
          price: 1299.99,
          tax: 104.00
        },
        {
          sku: 'MOUSE-W2',
          name: 'Wireless Mouse',
          quantity: 2,
          price: 29.99,
          tax: 4.80
        }
      ],
      shipping: {
        method: 'express',
        cost: 15.99,
        address: '123 Main St, San Francisco, CA 94102'
      },
      totals: {
        subtotal: 1359.97,
        tax: 108.80,
        shipping: 15.99,
        total: 1484.76
      }
    }
  }
}

console.log('=== E-commerce API Response ===\n')

// Convert to MINOTE
const minoteFormat = toMinote(apiResponse, {
  useTables: true,
  preserveTypes: true
})

console.log('MINOTE Format:')
console.log(minoteFormat)
console.log('\n---\n')

// Convert back to JSON
const jsonFormat = toJson(minoteFormat)

console.log('Roundtrip Result:', JSON.stringify(jsonFormat, null, 2))

// Token comparison
const jsonTokens = JSON.stringify(apiResponse).length / 4 // Rough estimate
const minoteTokens = minoteFormat.length / 4

console.log(`\nToken Savings:`)
console.log(`- JSON: ~${Math.round(jsonTokens)} tokens`)
console.log(`- MINOTE: ~${Math.round(minoteTokens)} tokens`)
console.log(`- Reduction: ${Math.round(((jsonTokens - minoteTokens) / jsonTokens) * 100)}%`)
