# @minote/cli

> Command-line tools for MINOTE (Minimal Notation for LLMs)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`@minote/cli` provides command-line tools for working with MINOTE files, including conversion, parsing, formatting, validation, and token analysis.

## Installation

```bash
npm install -g minote-cli
# or
pnpm add -g minote-cli
# or
yarn global add minote-cli
```

## Quick Start

```bash
# Convert JSON to MINOTE
minote convert data.json -t minote -o data.minote

# Convert MINOTE to JSON
minote convert data.minote -t json -o data.json

# Format MINOTE file
minote format data.minote

# Analyze token savings
minote analyze data.json

# Validate syntax
minote validate data.minote
```

## Commands

### `minote convert`

Convert between MINOTE and JSON formats.

```bash
# JSON to MINOTE
minote convert data.json -t minote -o data.minote

# MINOTE to JSON (pretty-printed)
minote convert data.minote -t json -o data.json

# Convert to stdout (no -o flag)
minote convert data.json -t minote

# Disable tables
minote convert data.json -t minote --no-tables

# Disable type annotations
minote convert data.json -t minote --no-types

# Set minimum table rows
minote convert data.json -t minote --min-table-rows 5
```

**Options:**
- `-t, --to <format>` - Target format: `minote` or `json` (default: `json`)
- `-o, --output <file>` - Output file (default: stdout)
- `--no-types` - Omit type annotations (MINOTE output)
- `--no-tables` - Disable table optimization (MINOTE output)
- `--min-table-rows <n>` - Minimum rows for table format (default: 3)

### `minote parse`

Parse MINOTE file to AST (Abstract Syntax Tree).

```bash
# Parse to AST
minote parse data.minote

# Save AST to file
minote parse data.minote -o ast.json

# Pretty-print AST
minote parse data.minote --pretty
```

**Options:**
- `-o, --output <file>` - Output file (default: stdout)
- `-j, --json` - Output as JSON (default: true)
- `-p, --pretty` - Pretty print output (default: true)

### `minote format`

Format/prettify MINOTE files.

```bash
# Format file (overwrite)
minote format data.minote

# Save to different file
minote format data.minote -o formatted.minote

# Custom indent
minote format data.minote -i 4

# Check if already formatted (exit 1 if not)
minote format data.minote --check
```

**Options:**
- `-o, --output <file>` - Output file (default: overwrite input)
- `-i, --indent <n>` - Indent size (default: 2)
- `--check` - Check if formatted (exit 1 if not, 0 if formatted)

### `minote analyze`

Analyze token usage and compare MINOTE vs JSON.

```bash
# Analyze JSON file
minote analyze data.json

# Analyze MINOTE file
minote analyze data.minote

# Specify format explicitly
minote analyze data.txt -f json
minote analyze data.txt -f minote

# Choose tokenizer
minote analyze data.json --tokenizer gpt4
minote analyze data.json --tokenizer claude
```

**Options:**
- `-f, --format <format>` - Input format: `auto`, `minote`, or `json` (default: auto)
- `--tokenizer <name>` - Tokenizer to use: `gpt4` or `claude` (default: gpt4)

**Example Output:**
```
Token Usage Analysis
──────────────────────────────────────────────────
JSON:    320 tokens
MINOTE:  170 tokens
Reduction: -47.0%

Note: Token estimates are approximate (4 chars/token)
```

### `minote validate`

Validate MINOTE file syntax.

```bash
# Validate syntax
minote validate data.minote

# Validate against schema
minote validate data.minote -s schema.minote

# Strict mode (warnings as errors)
minote validate data.minote --strict
```

**Options:**
- `-s, --schema <file>` - Schema file for validation
- `--strict` - Strict mode (treat warnings as errors)

## Examples

### Convert Employee Data

```bash
# employees.json
{
  "employees": [
    {"id": "e001", "name": "Alice", "dept": "Engineering", "salary": 150000},
    {"id": "e002", "name": "Bob", "dept": "Marketing", "salary": 120000}
  ]
}

# Convert to MINOTE
minote convert employees.json -t minote -o employees.minote

# Result: employees.minote
employees
  #Row[id@s name@s dept@s salary@i]
  |e001|Alice|Engineering|150000|
  |e002|Bob|Marketing|120000|

# Token savings: ~50%! 🚀
```

### Format Pipeline

```bash
# Generate MINOTE from JSON
cat data.json | minote convert -t minote > data.minote

# Format it
minote format data.minote

# Validate it
minote validate data.minote

# Analyze savings
minote analyze data.json
```

### CI/CD Integration

```bash
# Check if all MINOTE files are formatted
find . -name "*.minote" -exec minote format {} --check \;

# Exit code 0 if all formatted, 1 if any unformatted
```

## Output

All commands provide:
- ✅ **Colorized output** for better readability
- ✅ **Progress indicators** for long operations
- ✅ **Token statistics** showing savings
- ✅ **Error messages** with helpful context

## Integration

### NPM Scripts

```json
{
  "scripts": {
    "minote:convert": "minote convert data.json -t minote -o data.minote",
    "minote:format": "minote format **/*.minote",
    "minote:validate": "minote validate **/*.minote",
    "minote:analyze": "minote analyze data.json"
  }
}
```

### Git Hooks

```bash
# .git/hooks/pre-commit
#!/bin/bash
minote format **/*.minote --check || {
  echo "MINOTE files not formatted. Run: minote format **/*.minote"
  exit 1
}
```

## Exit Codes

- `0` - Success
- `1` - Error (parse error, validation failed, file not found, etc.)

## Requirements

- Node.js >= 18.0.0

## Dependencies

- `minote` - Core MINOTE library
- `commander` - CLI framework
- `chalk` - Terminal colors
- `ora` - Spinners

## License

MIT © Ersin Koc

## Links

- [Main Documentation](../../README.md)
- [Core Package](../core/README.md)
- [API Reference](../../docs/API.md)
- [GitHub](https://github.com/ersinkoc/minote)

---

**MINOTE CLI** - Command-line tools for token-efficient data. 🚀
