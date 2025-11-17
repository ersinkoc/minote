/**
 * Example: Database Query Results
 *
 * Demonstrates how MINOTE's table format shines with
 * uniform database records - achieving 60%+ token savings!
 */

import { toMinote, toJson } from 'minote'

// SQL query result: SELECT * FROM employees WHERE department = 'Engineering'
const queryResults = {
  query: 'SELECT * FROM employees WHERE department = ?',
  params: ['Engineering'],
  rowCount: 5,
  rows: [
    {
      id: 1001,
      firstName: 'Alice',
      lastName: 'Chen',
      email: 'alice.chen@company.com',
      department: 'Engineering',
      title: 'Senior Engineer',
      salary: 150000,
      hireDate: '2020-01-15',
      active: true
    },
    {
      id: 1002,
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@company.com',
      department: 'Engineering',
      title: 'Tech Lead',
      salary: 175000,
      hireDate: '2019-03-20',
      active: true
    },
    {
      id: 1003,
      firstName: 'Charlie',
      lastName: 'Wang',
      email: 'charlie.wang@company.com',
      department: 'Engineering',
      title: 'Staff Engineer',
      salary: 185000,
      hireDate: '2018-06-10',
      active: true
    },
    {
      id: 1004,
      firstName: 'Diana',
      lastName: 'Patel',
      email: 'diana.patel@company.com',
      department: 'Engineering',
      title: 'Principal Engineer',
      salary: 210000,
      hireDate: '2017-09-05',
      active: true
    },
    {
      id: 1005,
      firstName: 'Eve',
      lastName: 'Johnson',
      email: 'eve.johnson@company.com',
      department: 'Engineering',
      title: 'Engineering Manager',
      salary: 195000,
      hireDate: '2019-11-12',
      active: false
    }
  ]
}

console.log('=== Database Query Results ===\n')

// Convert to MINOTE - tables are automatically detected!
const minoteFormat = toMinote(queryResults, {
  useTables: true,
  minTableRows: 3, // Optimize arrays with 3+ uniform objects
  preserveTypes: true
})

console.log('MINOTE Format (note the automatic table optimization):')
console.log(minoteFormat)
console.log('\n---\n')

// Perfect roundtrip
const jsonFormat = toJson(minoteFormat)
const isIdentical = JSON.stringify(jsonFormat) === JSON.stringify(queryResults)

console.log('Roundtrip Test:', isIdentical ? '✅ PASSED' : '❌ FAILED')

// Token analysis
const jsonStr = JSON.stringify(queryResults)
const jsonTokens = jsonStr.length / 4
const minoteTokens = minoteFormat.length / 4

console.log(`\nToken Analysis:`)
console.log(`- JSON: ~${Math.round(jsonTokens)} tokens (${jsonStr.length} chars)`)
console.log(`- MINOTE: ~${Math.round(minoteTokens)} tokens (${minoteFormat.length} chars)`)
console.log(`- Reduction: ${Math.round(((jsonTokens - minoteTokens) / jsonTokens) * 100)}%`)
console.log(`\n💡 Table format saves 60%+ tokens for uniform data!`)
