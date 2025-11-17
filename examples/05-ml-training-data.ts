/**
 * Example: Machine Learning Training Data
 *
 * Demonstrates extreme token savings (60%+) for ML datasets
 * where MINOTE's table format is perfectly suited.
 */

import { toMinote, toJson } from 'minote'

// ML training dataset - customer churn prediction
const trainingData = {
  dataset: 'customer_churn',
  features: ['tenure', 'monthlyCharges', 'totalCharges', 'numServices', 'contractType'],
  target: 'churn',
  samples: [
    {
      tenure: 24,
      monthlyCharges: 89.99,
      totalCharges: 2159.76,
      numServices: 4,
      contractType: 'monthly',
      churn: 1
    },
    {
      tenure: 48,
      monthlyCharges: 65.50,
      totalCharges: 3144.00,
      numServices: 2,
      contractType: 'yearly',
      churn: 0
    },
    {
      tenure: 12,
      monthlyCharges: 120.00,
      totalCharges: 1440.00,
      numServices: 6,
      contractType: 'monthly',
      churn: 1
    },
    {
      tenure: 36,
      monthlyCharges: 75.25,
      totalCharges: 2709.00,
      numServices: 3,
      contractType: '2year',
      churn: 0
    },
    {
      tenure: 6,
      monthlyCharges: 95.00,
      totalCharges: 570.00,
      numServices: 5,
      contractType: 'monthly',
      churn: 1
    },
    {
      tenure: 60,
      monthlyCharges: 55.00,
      totalCharges: 3300.00,
      numServices: 1,
      contractType: '2year',
      churn: 0
    }
  ],
  metadata: {
    totalSamples: 6,
    positiveClass: 3,
    negativeClass: 3,
    splitDate: '2025-01-01'
  }
}

console.log('=== ML Training Dataset ===\n')

// Convert to MINOTE - massive savings with table format!
const minoteFormat = toMinote(trainingData, {
  useTables: true,
  minTableRows: 3,
  preserveTypes: true
})

console.log('MINOTE Format (note the compact table):')
console.log(minoteFormat)
console.log('\n---\n')

// Perfect roundtrip
const restored = toJson(minoteFormat)
const isIdentical = JSON.stringify(restored) === JSON.stringify(trainingData)

console.log('Data Integrity:', isIdentical ? '✅ 100% Preserved' : '❌ Data Loss')

// Token analysis - this is where MINOTE shines!
const jsonStr = JSON.stringify(trainingData)
const jsonTokens = jsonStr.length / 4
const minoteTokens = minoteFormat.length / 4
const savings = ((jsonTokens - minoteTokens) / jsonTokens) * 100

console.log(`\nToken Analysis:`)
console.log(`- JSON: ~${Math.round(jsonTokens)} tokens`)
console.log(`- MINOTE: ~${Math.round(minoteTokens)} tokens`)
console.log(`- Reduction: ${Math.round(savings)}%`)
console.log(`\n💰 Cost Savings for LLM API:`)
console.log(`- At $0.01/1K tokens: Save $${((savings / 100) * jsonTokens * 0.01 / 1000).toFixed(4)} per request`)
console.log(`- For 1M samples: Save $${((savings / 100) * jsonTokens * 0.01 * 166667 / 1000).toFixed(2)}`)
console.log(`\n🚀 MINOTE is perfect for ML pipelines with LLMs!`)
