import { useState } from 'react'

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyCode = (code: string, section: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">API Documentation</h1>
          <p className="page-subtitle">
            Complete reference for the MINOTE API with examples and type annotations.
          </p>
        </div>

        {/* Installation */}
        <section className="docs-section">
          <h2>Installation</h2>
          <p>Install MINOTE using your preferred package manager:</p>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">npm</h3>
              <button
                className={`copy-button ${copiedSection === 'npm' ? 'copied' : ''}`}
                onClick={() => copyCode('npm install minote', 'npm')}
              >
                {copiedSection === 'npm' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre><code>npm install minote</code></pre>
          </div>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">yarn</h3>
              <button
                className={`copy-button ${copiedSection === 'yarn' ? 'copied' : ''}`}
                onClick={() => copyCode('yarn add minote', 'yarn')}
              >
                {copiedSection === 'yarn' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre><code>yarn add minote</code></pre>
          </div>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">pnpm</h3>
              <button
                className={`copy-button ${copiedSection === 'pnpm' ? 'copied' : ''}`}
                onClick={() => copyCode('pnpm add minote', 'pnpm')}
              >
                {copiedSection === 'pnpm' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre><code>pnpm add minote</code></pre>
          </div>
        </section>

        {/* Core API */}
        <section className="docs-section">
          <h2>Core API</h2>

          {/* toMinote */}
          <div className="api-method">
            <h3>toMinote()</h3>
            <div className="api-signature">
              <code>{`toMinote(data: any, options?: ConversionOptions): string`}</code>
            </div>
            <p className="api-description">
              Converts a JavaScript object or value to MINOTE format string.
              Automatically detects and optimizes uniform arrays into compact table format.
            </p>

            <div className="api-params">
              <h4>Parameters</h4>
              <div className="param-item">
                <span className="param-name">data</span>
                <span className="param-type">any</span>
                <p style={{ margin: 'var(--space-xs) 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  The JavaScript value to convert to MINOTE format.
                </p>
              </div>
              <div className="param-item">
                <span className="param-name">options</span>
                <span className="param-type">ConversionOptions (optional)</span>
                <p style={{ margin: 'var(--space-xs) 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Configuration options for the conversion.
                </p>
              </div>
            </div>

            <div className="code-example" style={{ marginTop: 'var(--space-lg)' }}>
              <div className="code-example-header">
                <h3 className="code-example-title">Example</h3>
                <button
                  className={`copy-button ${copiedSection === 'toMinote' ? 'copied' : ''}`}
                  onClick={() => copyCode(`import { toMinote } from 'minote'

const user = {
  name: 'Alice',
  age: 30,
  active: true
}

const minote = toMinote(user)
console.log(minote)
// Output:
// name: Alice
// age: 30
// active: true`, 'toMinote')}
                >
                  {copiedSection === 'toMinote' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre><code>{`import { toMinote } from 'minote'

const user = {
  name: 'Alice',
  age: 30,
  active: true
}

const minote = toMinote(user)
console.log(minote)
// Output:
// name: Alice
// age: 30
// active: true`}</code></pre>
            </div>
          </div>

          {/* toJson */}
          <div className="api-method">
            <h3>toJson()</h3>
            <div className="api-signature">
              <code>{`toJson(minote: string): any`}</code>
            </div>
            <p className="api-description">
              Converts a MINOTE format string back to a JavaScript object.
              Perfectly preserves all data types and structure from the original conversion.
            </p>

            <div className="api-params">
              <h4>Parameters</h4>
              <div className="param-item">
                <span className="param-name">minote</span>
                <span className="param-type">string</span>
                <p style={{ margin: 'var(--space-xs) 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  The MINOTE format string to parse and convert back to JavaScript.
                </p>
              </div>
            </div>

            <div className="code-example" style={{ marginTop: 'var(--space-lg)' }}>
              <div className="code-example-header">
                <h3 className="code-example-title">Example</h3>
                <button
                  className={`copy-button ${copiedSection === 'toJson' ? 'copied' : ''}`}
                  onClick={() => copyCode(`import { toJson } from 'minote'

const minote = \`
name: Alice
age: 30
active: true
\`

const data = toJson(minote)
console.log(data)
// Output: { name: 'Alice', age: 30, active: true }`, 'toJson')}
                >
                  {copiedSection === 'toJson' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre><code>{`import { toJson } from 'minote'

const minote = \`
name: Alice
age: 30
active: true
\`

const data = toJson(minote)
console.log(data)
// Output: { name: 'Alice', age: 30, active: true }`}</code></pre>
            </div>
          </div>

          {/* parse */}
          <div className="api-method">
            <h3>parse()</h3>
            <div className="api-signature">
              <code>{`parse(input: string): ASTNode`}</code>
            </div>
            <p className="api-description">
              Parses a MINOTE format string into an Abstract Syntax Tree (AST).
              Useful for advanced use cases where you need to manipulate the parsed structure
              before converting to JavaScript.
            </p>

            <div className="api-params">
              <h4>Parameters</h4>
              <div className="param-item">
                <span className="param-name">input</span>
                <span className="param-type">string</span>
                <p style={{ margin: 'var(--space-xs) 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  The MINOTE format string to parse into an AST.
                </p>
              </div>
            </div>

            <div className="code-example" style={{ marginTop: 'var(--space-lg)' }}>
              <div className="code-example-header">
                <h3 className="code-example-title">Example</h3>
                <button
                  className={`copy-button ${copiedSection === 'parse' ? 'copied' : ''}`}
                  onClick={() => copyCode(`import { parse } from 'minote'

const minote = 'name: Alice\\nage: 30'
const ast = parse(minote)
console.log(JSON.stringify(ast, null, 2))`, 'parse')}
                >
                  {copiedSection === 'parse' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre><code>{`import { parse } from 'minote'

const minote = 'name: Alice\\nage: 30'
const ast = parse(minote)
console.log(JSON.stringify(ast, null, 2))`}</code></pre>
            </div>
          </div>

          {/* stringify */}
          <div className="api-method">
            <h3>stringify()</h3>
            <div className="api-signature">
              <code>{`stringify(ast: ASTNode, options?: ConversionOptions): string`}</code>
            </div>
            <p className="api-description">
              Converts an Abstract Syntax Tree back to a MINOTE format string.
              Useful when you've manipulated the AST and want to serialize it back to MINOTE.
            </p>

            <div className="api-params">
              <h4>Parameters</h4>
              <div className="param-item">
                <span className="param-name">ast</span>
                <span className="param-type">ASTNode</span>
                <p style={{ margin: 'var(--space-xs) 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  The Abstract Syntax Tree to convert to MINOTE format.
                </p>
              </div>
              <div className="param-item">
                <span className="param-name">options</span>
                <span className="param-type">ConversionOptions (optional)</span>
                <p style={{ margin: 'var(--space-xs) 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Configuration options for stringification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Table Format */}
        <section className="docs-section">
          <h2>Table Format</h2>
          <p>
            MINOTE automatically converts uniform arrays (arrays of objects with the same keys)
            into a compact table format, achieving up to 60% token reduction.
          </p>

          <h3>Automatic Table Detection</h3>
          <p>
            When an array contains 3 or more objects with identical keys, MINOTE automatically
            converts it to table format:
          </p>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">JSON Input</h3>
            </div>
            <pre><code>{`{
  "users": [
    { "id": 1, "name": "Alice", "role": "Admin" },
    { "id": 2, "name": "Bob", "role": "User" },
    { "id": 3, "name": "Charlie", "role": "User" }
  ]
}`}</code></pre>
          </div>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">MINOTE Output (Table Format)</h3>
            </div>
            <pre><code>{`users
  | id | name    | role  |
  | 1  | Alice   | Admin |
  | 2  | Bob     | User  |
  | 3  | Charlie | User  |`}</code></pre>
          </div>

          <h3>Configuration</h3>
          <p>You can control table formatting with the <code>ConversionOptions</code>:</p>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">Table Options</h3>
              <button
                className={`copy-button ${copiedSection === 'tableOptions' ? 'copied' : ''}`}
                onClick={() => copyCode(`const minote = toMinote(data, {
  useTables: true,        // Enable table detection (default: true)
  minTableRows: 3,        // Minimum rows for table format (default: 3)
  preserveTypes: true     // Preserve type annotations (default: true)
})`, 'tableOptions')}
              >
                {copiedSection === 'tableOptions' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre><code>{`const minote = toMinote(data, {
  useTables: true,        // Enable table detection (default: true)
  minTableRows: 3,        // Minimum rows for table format (default: 3)
  preserveTypes: true     // Preserve type annotations (default: true)
})`}</code></pre>
          </div>
        </section>

        {/* Type Preservation */}
        <section className="docs-section">
          <h2>Type Preservation</h2>
          <p>
            MINOTE preserves all JSON data types through type annotations.
            This ensures perfect roundtrip conversion without data loss.
          </p>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">All Supported Types</h3>
            </div>
            <pre><code>{`{
  "string": "Hello",
  "number": 42,
  "float": 3.14,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": { "key": "value" }
}`}</code></pre>
          </div>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">MINOTE with Type Annotations</h3>
            </div>
            <pre><code>{`string: Hello
number: 42
float: 3.14
boolean: true
null: null
array: [1, 2, 3]
object
  key: value`}</code></pre>
          </div>
        </section>

        {/* Best Practices */}
        <section className="docs-section">
          <h2>Best Practices</h2>

          <h3>When to Use MINOTE</h3>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <li>Sending structured data to LLM APIs to reduce token costs</li>
            <li>Processing database query results with uniform schemas</li>
            <li>Compressing API responses before LLM analysis</li>
            <li>Training data for machine learning with LLMs</li>
            <li>Configuration files that need to be LLM-readable</li>
          </ul>

          <h3>Maximum Savings</h3>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <li>Use table format for arrays with 3+ uniform objects (60%+ savings)</li>
            <li>Minimize deeply nested structures when possible</li>
            <li>Keep property names concise but meaningful</li>
            <li>Leverage type inference for common types</li>
          </ul>

          <h3>Type Safety</h3>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <li>Always use TypeScript for compile-time type checking</li>
            <li>Enable <code>preserveTypes</code> option for guaranteed roundtrip accuracy</li>
            <li>Validate data before conversion in production environments</li>
          </ul>
        </section>

        {/* Links */}
        <section className="docs-section">
          <h2>Additional Resources</h2>
          <div className="features-grid" style={{ marginTop: 'var(--space-lg)' }}>
            <a href="https://github.com/ersinkoc/minote" className="feature-card" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <h3 className="feature-title">GitHub Repository</h3>
              <p className="feature-description">
                View source code, report issues, and contribute to the project.
              </p>
            </a>
            <a href="/playground" className="feature-card" style={{ textDecoration: 'none' }}>
              <h3 className="feature-title">Interactive Playground</h3>
              <p className="feature-description">
                Try MINOTE in your browser with live examples and token counting.
              </p>
            </a>
            <a href="/examples" className="feature-card" style={{ textDecoration: 'none' }}>
              <h3 className="feature-title">Example Gallery</h3>
              <p className="feature-description">
                Explore real-world examples showcasing MINOTE's capabilities.
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
