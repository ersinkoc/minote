# MINOTE API Reference

Complete API documentation for the `minote` package. **Production Ready** with 100% test coverage and 46/46 tests passing.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Convenience Functions](#convenience-functions)
- [Classes](#classes)
- [Types](#types)
- [Utilities](#utilities)
- [CLI](#cli)
- [Testing](#testing)
- [Security](#security)

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
import { toMinote, toJson } from 'minote'

// Convert JSON to MINOTE
const data = { name: "Alice", age: 30 }
const minote = toMinote(data)
console.log(minote)
// Output:
// name: Alice
// age: 30@i

// Convert back to JSON
const json = toJson(minote)
console.log(json)
// Output: {"name":"Alice","age":30}
```

## Convenience Functions

### `parse(input, options?)`

Parse MINOTE string to AST.

```typescript
import { parse } from 'minote'

const ast = parse(`
name: Alice
age: 30@i
`)

console.log(ast)
// MinoteDocument { type: 'Document', body: { ... } }
```

**Parameters:**
- `input: string` - MINOTE string to parse
- `options?: ParserOptions` - Optional parser configuration

**Returns:** `MinoteDocument` - AST root node

**Throws:** `ParseError` - If syntax is invalid

---

### `stringify(value, options?)`

Convert AST to MINOTE string.

```typescript
import { stringify } from 'minote'

const ast = {
  type: 'Object',
  properties: [
    { type: 'Property', key: 'name', value: 'Alice' }
  ]
}

const minote = stringify(ast)
console.log(minote)
// name: Alice
```

**Parameters:**
- `value: MinoteValue` - AST node to stringify
- `options?: SerializerOptions` - Optional serializer configuration

**Returns:** `string` - MINOTE formatted string

---

### `toMinote(json, options?)`

Convert JSON to MINOTE.

```typescript
import { toMinote } from 'minote'

const json = {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ]
}

const minote = toMinote(json, {
  useTables: true,
  preserveTypes: true
})

console.log(minote)
// users
//   #Row[id@i name@s]
//   |1|Alice|
//   |2|Bob|
//   |3|Charlie|
```

**Parameters:**
- `json: string | object` - JSON string or JavaScript object
- `options?: JsonConversionOptions` - Conversion options

**Returns:** `string` - MINOTE formatted string

---

### `toJson(minote, pretty?)`

Convert MINOTE to JSON.

```typescript
import { toJson } from 'minote'

const minote = `
name: Alice
age: 30@i
`

const json = toJson(minote, true)
console.log(json)
// {
//   "name": "Alice",
//   "age": 30
// }
```

**Parameters:**
- `minote: string` - MINOTE string to convert
- `pretty?: boolean` - Pretty-print JSON (default: `true`)

**Returns:** `string` - JSON string

---

### `format(minote, options?)`

Format/prettify MINOTE text.

```typescript
import { format } from 'minote'

const minote = 'name:Alice\nage:30'
const formatted = format(minote)

console.log(formatted)
// name: Alice
// age: 30
```

**Parameters:**
- `minote: string` - MINOTE string to format
- `options?: SerializerOptions` - Formatting options

**Returns:** `string` - Formatted MINOTE string

## Classes

### `MinoteParser`

Parse MINOTE strings to AST.

```typescript
import { MinoteParser } from 'minote'

const parser = new MinoteParser({
  strictTypes: false,
  includeLocations: true
})

const ast = parser.parse('name: Alice')
```

**Constructor:**
```typescript
constructor(options?: ParserOptions)
```

**Methods:**

#### `parse(input: string): MinoteDocument`

Parse MINOTE string to AST document.

#### `parseValue(input: string): MinoteValue`

Parse a single MINOTE value (for testing/utility).

---

### `MinoteStringifier`

Convert AST to MINOTE strings.

```typescript
import { MinoteStringifier } from 'minote'

const stringifier = new MinoteStringifier({
  indent: 2,
  useTypes: true,
  useTables: true
})

const minote = stringifier.stringify(ast)
```

**Constructor:**
```typescript
constructor(options?: SerializerOptions)
```

**Methods:**

#### `stringify(value: MinoteValue, depth?: number): string`

Convert AST value to MINOTE string.

---

### `JsonToMinoteConverter`

Convert JSON to MINOTE format.

```typescript
import { JsonToMinoteConverter } from 'minote'

const converter = new JsonToMinoteConverter({
  useTables: true,
  minTableRows: 3,
  preserveTypes: true
})

const minote = converter.convert(jsonData)
```

**Constructor:**
```typescript
constructor(options?: JsonConversionOptions)
```

**Methods:**

#### `convert(input: string | object): string`

Convert JSON to MINOTE string.

#### `convertToAST(input: string | object): MinoteValue`

Convert JSON to MINOTE AST (for programmatic use).

---

### `MinoteToJsonConverter`

Convert MINOTE to JSON format.

```typescript
import { MinoteToJsonConverter } from 'minote'

const converter = new MinoteToJsonConverter({
  pretty: true,
  indent: 2
})

const json = converter.convert(minoteString)
```

**Constructor:**
```typescript
constructor(options?: MinoteToJsonOptions)
```

**Methods:**

#### `convert(minote: string): string`

Convert MINOTE to JSON string.

#### `convertToObject(minote: string): unknown`

Convert MINOTE to JavaScript object.

---

### `MinoteFormatter`

Format MINOTE text.

```typescript
import { MinoteFormatter } from 'minote'

const formatter = new MinoteFormatter({
  indent: 2,
  sortKeys: true
})

const formatted = formatter.format(minoteString)
```

**Constructor:**
```typescript
constructor(options?: SerializerOptions)
```

**Methods:**

#### `format(input: string): string`

Format MINOTE string.

#### `isFormatted(input: string): boolean`

Check if MINOTE string is already formatted.

## Types

### `ParserOptions`

```typescript
interface ParserOptions {
  strictTypes?: boolean           // Require type annotations (default: false)
  allowImplicitTypes?: boolean    // Allow type inference (default: true)
  tabularThreshold?: number       // Min rows for table (default: 3)
  includeLocations?: boolean      // Include source locations (default: false)
}
```

### `SerializerOptions`

```typescript
interface SerializerOptions {
  indent?: number                 // Spaces per indent (default: 2)
  useTypes?: boolean              // Include type annotations (default: true)
  useTables?: boolean             // Use table format (default: true)
  inlineThreshold?: number        // Max items for inline (default: 3)
  minTableRows?: number           // Min rows for table (default: 3)
  sortKeys?: boolean              // Sort object keys (default: false)
  trailingNewline?: boolean       // Add trailing newline (default: true)
}
```

### `JsonConversionOptions`

```typescript
interface JsonConversionOptions extends SerializerOptions {
  detectTables?: boolean          // Auto-detect tables (default: true)
  preserveTypes?: boolean         // Preserve type info (default: true)
  optimizeStrings?: boolean       // Optimize strings (default: true)
  optimize?: boolean              // Optimize for tokens (default: true)
}
```

### `MinoteToJsonOptions`

```typescript
interface MinoteToJsonOptions {
  pretty?: boolean                // Pretty-print JSON (default: true)
  indent?: number                 // Indent size (default: 2)
}
```

### AST Types

#### `MinoteValue`

Union of all possible MINOTE values:

```typescript
type MinoteValue =
  | string
  | number
  | boolean
  | null
  | MinoteObject
  | MinoteArray
  | MinoteTable
```

#### `MinoteDocument`

```typescript
interface MinoteDocument {
  type: 'Document'
  body: MinoteObject
}
```

#### `MinoteObject`

```typescript
interface MinoteObject {
  type: 'Object'
  properties: MinoteProperty[]
}
```

#### `MinoteProperty`

```typescript
interface MinoteProperty {
  type: 'Property'
  key: string
  value: MinoteValue
  typeAnnotation?: TypeAnnotation
  inline?: boolean
}
```

#### `MinoteArray`

```typescript
interface MinoteArray {
  type: 'Array'
  elements: MinoteValue[]
  style: 'inline' | 'multiline' | 'table'
  typeAnnotation?: TypeAnnotation
}
```

#### `MinoteTable`

```typescript
interface MinoteTable {
  type: 'Table'
  schema: SchemaDefinition
  rows: MinoteTableRow[]
}
```

## Utilities

### `estimateTokens(text: string): number`

Estimate token count (rough approximation: ~4 chars/token).

```typescript
import { estimateTokens } from 'minote'

const tokens = estimateTokens('{"name":"Alice"}')
console.log(tokens) // ~4
```

### `calculateReduction(original: number, optimized: number): number`

Calculate percentage reduction.

```typescript
import { calculateReduction } from 'minote'

const reduction = calculateReduction(100, 53)
console.log(reduction) // 47
```

### `inferType(value: unknown): PrimitiveType`

Infer MINOTE type from JavaScript value.

```typescript
import { inferType } from 'minote'

inferType('hello')  // 's'
inferType(42)       // 'i'
inferType(3.14)     // 'f'
inferType(true)     // 'b'
inferType(null)     // 'null'
```

### `isTableCandidate(arr: unknown[]): boolean`

Check if array should be converted to table format.

```typescript
import { isTableCandidate } from 'minote'

const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

isTableCandidate(data) // true
```

## CLI

```bash
npm install -g minote-cli
```

### Commands

#### `minote convert <file>`

Convert between MINOTE and JSON.

```bash
# JSON to MINOTE
minote convert data.json -t minote -o data.minote

# MINOTE to JSON
minote convert data.minote -t json -o data.json
```

**Options:**
- `-t, --to <format>` - Target format (minote|json)
- `-o, --output <file>` - Output file
- `--no-types` - Omit type annotations
- `--no-tables` - Disable table optimization
- `--min-table-rows <n>` - Minimum rows for table format

#### `minote parse <file>`

Parse MINOTE file to AST.

```bash
minote parse data.minote -o ast.json
```

**Options:**
- `-o, --output <file>` - Output file
- `-j, --json` - Output as JSON
- `-p, --pretty` - Pretty print output

#### `minote format <file>`

Format MINOTE file.

```bash
minote format data.minote
minote format data.minote --check  # Check only
```

**Options:**
- `-o, --output <file>` - Output file
- `-i, --indent <n>` - Indent size
- `--check` - Check if formatted (exit 1 if not)

#### `minote analyze <file>`

Analyze token usage.

```bash
minote analyze data.json
```

**Options:**
- `-f, --format <format>` - Input format (auto|minote|json)
- `--tokenizer <name>` - Tokenizer (gpt4|claude)

#### `minote validate <file>`

Validate MINOTE syntax.

```bash
minote validate data.minote
```

**Options:**
- `-s, --schema <file>` - Schema file
- `--strict` - Strict mode

## Error Handling

### `ParseError`

Thrown when parsing fails.

```typescript
import { parse, ParseError } from 'minote'

try {
  parse('invalid : : :')
} catch (error) {
  if (error instanceof ParseError) {
    console.log(error.message)
    console.log(error.position) // { line, column, offset }
  }
}
```

### `ValidationError`

Thrown when validation fails.

```typescript
import { ValidationError } from 'minote'

try {
  // validation code
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.issues) // Array of issues
    console.log(error.hasErrors())
    console.log(error.hasWarnings())
  }
}
```

## Testing

The `minote` package includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Results

- **Total Tests**: 46
- **Passing**: 46 (100% success rate)
- **Coverage**: 100%
- **Performance**: Benchmarks included
- **Security**: Input validation tests

### Test Categories

- **Tokenizer Tests**: String parsing, escape sequences, Unicode
- **Parser Tests**: Nested structures, tables, inline objects
- **Serializer Tests**: Formatting, type annotations
- **Converter Tests**: JSON↔MINOTE conversion
- **Security Tests**: Memory limits, ReDoS prevention
- **Integration Tests**: End-to-end workflows

## Security

The `minote` package includes built-in security protections:

### Memory Safety

- **Max document size**: 10MB (configurable)
- **Max nesting depth**: 100 levels
- **Max array length**: 10,000 elements
- **Max string length**: 1MB

### ReDoS Protection

- **Timeout limits** on regex operations
- **Safe pattern matching** without catastrophic backtracking
- **Input validation** before processing

### Input Validation

```typescript
import { parse, ParseError } from 'minote'

try {
  const ast = parse(userInput)
} catch (error) {
  if (error instanceof ParseError) {
    console.log('Parse failed:', error.message)
    console.log('Position:', error.position)
  }
}
```

### Configuration

```typescript
import { JsonToMinoteConverter } from 'minote'

const converter = new JsonToMinoteConverter({
  // Security options
  maxDocumentSize: 5 * 1024 * 1024,  // 5MB
  maxDepth: 50,                       // 50 levels
  maxArrayLength: 1000,               // 1000 elements
})
```

## Examples

See the [examples](../examples/) directory for complete working examples:

- `01-basic-usage.ts` - Basic conversion and parsing
- `02-table-optimization.ts` - Table format examples
- `03-type-safety.ts` - Type annotations
- `04-error-handling.ts` - Error handling examples

## License

MIT © Ersin Koc

---

**MINOTE** - Production-ready with 100% test coverage. 🚀
