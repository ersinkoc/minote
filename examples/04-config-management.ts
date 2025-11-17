/**
 * Example: Application Configuration
 *
 * Shows how MINOTE makes configuration files more readable
 * and token-efficient for LLM-based config management.
 */

import { toMinote, toJson, format } from 'minote'

// Application configuration
const appConfig = {
  app: {
    name: 'MyApp',
    version: '2.1.0',
    environment: 'production',
    debug: false,
    port: 8080
  },
  database: {
    host: 'db.example.com',
    port: 5432,
    name: 'myapp_prod',
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMs: 30000
    },
    ssl: true
  },
  cache: {
    provider: 'redis',
    host: 'cache.example.com',
    port: 6379,
    ttl: 3600,
    keyPrefix: 'myapp:'
  },
  logging: {
    level: 'info',
    format: 'json',
    outputs: ['console', 'file', 'syslog']
  },
  features: {
    authentication: true,
    analytics: true,
    darkMode: false,
    betaFeatures: false
  }
}

console.log('=== Application Configuration ===\n')

// Convert to MINOTE
const minoteFormat = toMinote(appConfig, {
  preserveTypes: true,
  sortKeys: false // Preserve logical grouping
})

console.log('MINOTE Format (human-readable config):')
console.log(minoteFormat)
console.log('\n---\n')

// Format for prettier output
const formatted = format(minoteFormat, {
  indent: 2
})

console.log('Formatted MINOTE:')
console.log(formatted)
console.log('\n---\n')

// Convert back
const restored = toJson(minoteFormat)

console.log('Restored Config:', JSON.stringify(restored, null, 2))

// Token comparison
const jsonTokens = JSON.stringify(appConfig).length / 4
const minoteTokens = minoteFormat.length / 4

console.log(`\nToken Savings:`)
console.log(`- JSON: ~${Math.round(jsonTokens)} tokens`)
console.log(`- MINOTE: ~${Math.round(minoteTokens)} tokens`)
console.log(`- Reduction: ${Math.round(((jsonTokens - minoteTokens) / jsonTokens) * 100)}%`)
console.log(`\n💡 Perfect for LLM-based configuration management!`)
