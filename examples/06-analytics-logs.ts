/**
 * Example: Analytics & Log Data
 *
 * Shows how MINOTE handles time-series and log data efficiently,
 * perfect for LLM-based log analysis and monitoring.
 */

import { toMinote, toJson } from 'minote'

// Analytics logs from a web service
const analyticsLogs = {
  service: 'api-gateway',
  timeRange: {
    start: '2025-01-01T00:00:00Z',
    end: '2025-01-01T00:05:00Z'
  },
  metrics: {
    totalRequests: 15,
    avgResponseTime: 145,
    errors: 2,
    successRate: 86.67
  },
  requests: [
    {
      timestamp: 1704067200,
      method: 'GET',
      path: '/api/users',
      status: 200,
      responseTime: 125,
      userId: 'user123'
    },
    {
      timestamp: 1704067205,
      method: 'POST',
      path: '/api/orders',
      status: 201,
      responseTime: 230,
      userId: 'user456'
    },
    {
      timestamp: 1704067210,
      method: 'GET',
      path: '/api/products',
      status: 200,
      responseTime: 95,
      userId: 'user789'
    },
    {
      timestamp: 1704067215,
      method: 'DELETE',
      path: '/api/cart/123',
      status: 500,
      responseTime: 450,
      userId: 'user123'
    },
    {
      timestamp: 1704067220,
      method: 'GET',
      path: '/api/users',
      status: 200,
      responseTime: 110,
      userId: 'user999'
    },
    {
      timestamp: 1704067225,
      method: 'PUT',
      path: '/api/profile',
      status: 404,
      responseTime: 85,
      userId: 'user456'
    },
    {
      timestamp: 1704067230,
      method: 'GET',
      path: '/api/orders',
      status: 200,
      responseTime: 140,
      userId: 'user789'
    }
  ],
  summary: {
    topPaths: ['/api/users', '/api/orders', '/api/products'],
    slowestRequest: '/api/cart/123',
    errorPaths: ['/api/cart/123', '/api/profile']
  }
}

console.log('=== Analytics & Log Data ===\n')

// Convert to MINOTE
const minoteFormat = toMinote(analyticsLogs, {
  useTables: true,
  minTableRows: 3,
  preserveTypes: true
})

console.log('MINOTE Format (efficient log representation):')
console.log(minoteFormat)
console.log('\n---\n')

// Roundtrip test
const restored = toJson(minoteFormat)
const isIdentical = JSON.stringify(restored) === JSON.stringify(analyticsLogs)

console.log('Data Integrity:', isIdentical ? '✅ Perfect' : '❌ Failed')
console.log('\n---\n')

// Token analysis
const jsonStr = JSON.stringify(analyticsLogs)
const jsonTokens = jsonStr.length / 4
const minoteTokens = minoteFormat.length / 4

console.log('Token Analysis:')
console.log(`- JSON: ~${Math.round(jsonTokens)} tokens`)
console.log(`- MINOTE: ~${Math.round(minoteTokens)} tokens`)
console.log(`- Reduction: ${Math.round(((jsonTokens - minoteTokens) / jsonTokens) * 100)}%`)

console.log(`\n🔍 Use Case: LLM-based Log Analysis`)
console.log(`- Send logs to LLM for anomaly detection`)
console.log(`- Use ${Math.round(((jsonTokens - minoteTokens) / jsonTokens) * 100)}% fewer tokens`)
console.log(`- Process more logs within context window`)
console.log(`- Reduce API costs significantly`)

console.log(`\n💡 Perfect for:`)
console.log(`  • Real-time monitoring with LLMs`)
console.log(`  • Log summarization and analysis`)
console.log(`  • Incident detection and diagnosis`)
console.log(`  • Performance analytics`)
