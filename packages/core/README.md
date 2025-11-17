# @minote/core

> Core parser, serializer, and converter for MINOTE (Minimal Notation for LLMs)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)
[![Tests Passing](https://img.shields.io/badge/Tests-46%2F46%20Passing-green)](../src/tests)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](../src/tests)

## Overview

`@minote/core` is the core library for parsing, serializing, and converting MINOTE format. It provides a complete toolkit for working with MINOTE data structures, with **zero runtime dependencies** and **100% test coverage**.

## Features

- ✅ **Full MINOTE Parser** - Tokenizer + AST generation
- ✅ **Bidirectional Conversion** - JSON ↔ MINOTE with 100% fidelity
- ✅ **Type-Safe** - Full TypeScript with strict mode
- ✅ **Table Optimization** - Automatic detection for uniform arrays
- ✅ **Type Annotations** - Explicit types (@i, @f, @s, @b)
- ✅ **Smart Formatting** - Inline vs multiline decisions
- ✅ **Zero Dependencies** - No runtime dependencies
- ✅ **Error Handling** - Detailed parse errors with source locations

## Installation

```bash
npm install minote
# or
pnpm add minote
# or
yarn add minote
```

## Quick Start

```typescript
import { toMinote, toJson, parse, stringify } from 'minote'

// Convert JSON to MINOTE
const data = {
  name: 'Alice',
  age: 30,
  tags: ['developer', 'designer']
}

const minote = toMinote(data)
console.log(minote)
// name: Alice
// age: 30@i
// tags: [developer designer]

// Convert back to JSON
const json = toJson(minote)
// {"name":"Alice","age":30,"tags":["developer","designer"]}

// Parse to AST
const ast = parse(minote)

// Stringify AST
const formatted = stringify(ast.body)
```

## API

### Convenience Functions

#### `toMinote(json, options?)`

Convert JSON to MINOTE.

```typescript
import { toMinote } from 'minote'

const minote = toMinote({ name: 'Alice', age: 30 }, {
  useTables: true,
  preserveTypes: true,
  minTableRows: 3
})
```

#### `toJson(minote, pretty?)`

Convert MINOTE to JSON.

```typescript
import { toJson } from 'minote'

const json = toJson('name: Alice\nage: 30', true)
// Pretty-printed JSON
```

#### `parse(input, options?)`

Parse MINOTE string to AST.

```typescript
import { parse } from 'minote'

const ast = parse('name: Alice\nage: 30@i')
// Returns MinoteDocument
```

#### `stringify(value, options?)`

Convert AST to MINOTE string.

```typescript
import { stringify } from 'minote'

const minote = stringify(ast.body, {
  indent: 2,
  useTypes: true
})
```

#### `format(minote, options?)`

Format/prettify MINOTE text.

```typescript
import { format } from 'minote'

const formatted = format('name:Alice\nage:30')
// name: Alice
// age: 30
```

### Classes

#### `MinoteParser`

```typescript
import { MinoteParser } from 'minote'

const parser = new MinoteParser({
  strictTypes: false,
  includeLocations: true
})

const ast = parser.parse('name: Alice')
```

#### `MinoteStringifier`

```typescript
import { MinoteStringifier } from 'minote'

const stringifier = new MinoteStringifier({
  indent: 2,
  useTypes: true,
  useTables: true
})

const minote = stringifier.stringify(ast)
```

#### `JsonToMinoteConverter`

```typescript
import { JsonToMinoteConverter } from 'minote'

const converter = new JsonToMinoteConverter({
  useTables: true,
  minTableRows: 3,
  preserveTypes: true
})

const minote = converter.convert(jsonData)
```

#### `MinoteToJsonConverter`

```typescript
import { MinoteToJsonConverter } from 'minote'

const converter = new MinoteToJsonConverter({
  pretty: true,
  indent: 2
})

const json = converter.convert(minoteString)
```

### Utilities

```typescript
import {
  estimateTokens,
  calculateReduction,
  inferType,
  isTableCandidate
} from 'minote'

// Estimate token count
const tokens = estimateTokens('{"name":"Alice"}')

// Calculate reduction
const reduction = calculateReduction(100, 53) // 47%

// Infer type
const type = inferType(42) // 'i'

// Check if array should be table
const shouldBeTable = isTableCandidate([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]) // true
```

## Options

### ParserOptions

```typescript
interface ParserOptions {
  strictTypes?: boolean        // Require type annotations (default: false)
  allowImplicitTypes?: boolean // Allow type inference (default: true)
  tabularThreshold?: number    // Min rows for table (default: 3)
  includeLocations?: boolean   // Include source locations (default: false)
}
```

### SerializerOptions

```typescript
interface SerializerOptions {
  indent?: number              // Spaces per indent (default: 2)
  useTypes?: boolean           // Include type annotations (default: true)
  useTables?: boolean          // Use table format (default: true)
  inlineThreshold?: number     // Max items for inline (default: 3)
  minTableRows?: number        // Min rows for table (default: 3)
  sortKeys?: boolean           // Sort object keys (default: false)
  trailingNewline?: boolean    // Add trailing newline (default: true)
}
```

### JsonConversionOptions

```typescript
interface JsonConversionOptions extends SerializerOptions {
  detectTables?: boolean       // Auto-detect tables (default: true)
  preserveTypes?: boolean      // Preserve type info (default: true)
  optimizeStrings?: boolean    // Optimize strings (default: true)
  optimize?: boolean           // Optimize for tokens (default: true)
}
```

## Examples

### Basic Conversion

```typescript
import { toMinote, toJson } from 'minote'

const user = {
  id: 'usr_123',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 30,
  active: true
}

const minote = toMinote(user)
// id: usr_123
// name: Alice Johnson
// email: alice@example.com
// age: 30@i
// active: true@b

const json = toJson(minote)
// Perfect roundtrip! ✅
```

### Table Optimization

```typescript
import { toMinote } from 'minote'

const data = {
  employees: [
    { id: 'e001', name: 'Alice', dept: 'Engineering', salary: 150000 },
    { id: 'e002', name: 'Bob', dept: 'Marketing', salary: 120000 },
    { id: 'e003', name: 'Charlie', dept: 'Engineering', salary: 140000 }
  ]
}

const minote = toMinote(data)
// employees
//   #Row[id@s name@s dept@s salary@i]
//   |e001|Alice|Engineering|150000|
//   |e002|Bob|Marketing|120000|
//   |e003|Charlie|Engineering|140000|

// 60% token reduction for tabular data! 🚀
```

### Custom Options

```typescript
import { JsonToMinoteConverter } from 'minote'

const converter = new JsonToMinoteConverter({
  indent: 4,
  useTypes: true,
  useTables: true,
  minTableRows: 5,
  sortKeys: true,
  preserveTypes: true
})

const minote = converter.convert(data)
```

## Error Handling

```typescript
import { parse, ParseError } from 'minote'

try {
  const ast = parse('invalid : : :')
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.message)
    console.log(error.position) // { line, column, offset }
    console.log(error.toString()) // Formatted error with source
  }
}
```

## TypeScript Support

Full TypeScript support with strict mode:

```typescript
import type {
  MinoteDocument,
  MinoteValue,
  MinoteObject,
  MinoteArray,
  MinoteTable,
  ParserOptions,
  SerializerOptions
} from 'minote'
```

## Performance

- **Parse 1KB**: ~1ms
- **Stringify 100 nodes**: ~0.5ms
- **JSON → MINOTE**: ~2ms
- **MINOTE → JSON**: ~2ms

Zero runtime dependencies = minimal bundle size!

## Testing

This package includes comprehensive test coverage:

- **46 tests** covering all functionality
- **100% test success rate**
- **100% code coverage**
- **Security tests** for input validation
- **Performance benchmarks**
- **Real-world examples**

```bash
# Run tests
pnpm test

# Run coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## License

MIT © Ersin Koc

## Links

- [Main Documentation](../../README.md)
- [API Reference](../../docs/API.md)
- [Specification](../../docs/SPECIFICATION.md)
- [GitHub](https://github.com/ersinkoc/minote)

---

**MINOTE** - Because every token counts. 🚀
