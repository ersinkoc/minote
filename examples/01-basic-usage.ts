/**
 * Basic MINOTE usage examples
 */

import { toMinote, toJson, parse, stringify } from 'minote'

// Example 1: Simple conversion
console.log('=== Example 1: Simple Conversion ===\n')

const user = {
  name: 'Alice',
  age: 30,
  active: true,
  email: 'alice@example.com',
}

const minote = toMinote(user)
console.log('MINOTE:')
console.log(minote)

const json = toJson(minote)
console.log('\nJSON:')
console.log(json)

// Example 2: Nested objects
console.log('\n\n=== Example 2: Nested Objects ===\n')

const company = {
  name: 'TechCorp',
  founded: 2010,
  headquarters: {
    city: 'San Francisco',
    country: 'USA',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
}

console.log('MINOTE:')
console.log(toMinote(company))

// Example 3: Arrays and tables
console.log('\n\n=== Example 3: Tables ===\n')

const employees = {
  company: 'TechCorp',
  employees: [
    { id: 'e001', name: 'Alice', dept: 'Engineering', salary: 150000 },
    { id: 'e002', name: 'Bob', dept: 'Marketing', salary: 120000 },
    { id: 'e003', name: 'Charlie', dept: 'Engineering', salary: 140000 },
  ],
}

console.log('MINOTE (with automatic table detection):')
console.log(toMinote(employees))

// Example 4: Parse and manipulate AST
console.log('\n\n=== Example 4: AST Manipulation ===\n')

const minoteInput = `
name: Alice
age: 30
contact
  email: alice@example.com
  phone: +1-555-0100
`.trim()

const ast = parse(minoteInput)
console.log('Parsed AST:')
console.log(JSON.stringify(ast, null, 2))

// Example 5: Token comparison
console.log('\n\n=== Example 5: Token Savings ===\n')

import { estimateTokens, calculateReduction } from 'minote'

const data = {
  users: [
    { id: 1, name: 'Alice', role: 'Admin', active: true },
    { id: 2, name: 'Bob', role: 'User', active: true },
    { id: 3, name: 'Charlie', role: 'User', active: false },
  ],
}

const jsonStr = JSON.stringify(data)
const minoteStr = toMinote(data)

const jsonTokens = estimateTokens(jsonStr)
const minoteTokens = estimateTokens(minoteStr)

console.log(`JSON:   ${jsonTokens} tokens`)
console.log(`MINOTE: ${minoteTokens} tokens`)
console.log(`Reduction: ${calculateReduction(jsonTokens, minoteTokens).toFixed(1)}%`)

console.log('\nJSON:')
console.log(jsonStr)
console.log('\nMINOTE:')
console.log(minoteStr)
