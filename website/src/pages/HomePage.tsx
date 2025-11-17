import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function HomePage() {
  const [copiedQuickStart, setCopiedQuickStart] = useState(false)
  const [copiedExample, setCopiedExample] = useState(false)

  const copyToClipboard = async (text: string, type: 'quickstart' | 'example') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'quickstart') {
        setCopiedQuickStart(true)
        setTimeout(() => setCopiedQuickStart(false), 2000)
      } else {
        setCopiedExample(true)
        setTimeout(() => setCopiedExample(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const installCommand = 'npm install minote'

  const quickStartCode = `import { toMinote, toJson } from 'minote'

const data = {
  users: [
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' }
  ]
}

// Convert to MINOTE
const minote = toMinote(data)
console.log(minote)

// Convert back to JSON
const json = toJson(minote)`

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-tagline fade-in">
            47% Token Reduction
          </div>
          <h1 className="hero-title slide-in">
            <span className="gradient-text">MINOTE</span>
            <br />
            Minimal Notation for LLMs
          </h1>
          <p className="hero-subtitle fade-in">
            Reduce LLM token usage by 47% without losing data. Zero dependencies, type-safe,
            with automatic table optimization for uniform data structures.
          </p>
          <div className="hero-cta fade-in">
            <Link to="/playground" className="btn btn-primary">
              Try Playground
            </Link>
            <Link to="/docs" className="btn btn-secondary">
              View Docs
            </Link>
            <a
              href="https://github.com/ersinkoc/minote"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="quick-start">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            Get Started in Seconds
          </h2>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">Installation</h3>
              <button
                className={`copy-button ${copiedQuickStart ? 'copied' : ''}`}
                onClick={() => copyToClipboard(installCommand, 'quickstart')}
              >
                {copiedQuickStart ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre><code>{installCommand}</code></pre>
          </div>

          <div className="code-example">
            <div className="code-example-header">
              <h3 className="code-example-title">Quick Start Example</h3>
              <button
                className={`copy-button ${copiedExample ? 'copied' : ''}`}
                onClick={() => copyToClipboard(quickStartCode, 'example')}
              >
                {copiedExample ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre><code>{quickStartCode}</code></pre>
          </div>
        </div>
      </section>

      {/* Token Comparison */}
      <section className="token-comparison">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
            Massive Token Savings
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            See how MINOTE dramatically reduces token usage compared to JSON,
            especially for tabular data.
          </p>

          <div className="comparison-grid">
            <div className="comparison-card fade-in">
              <div className="comparison-label">JSON Tokens</div>
              <div className="comparison-value">893</div>
              <div className="comparison-code">
{`{
  "query": "SELECT * FROM ...",
  "rows": [
    {"id": 1, "name": "Alice", ...},
    {"id": 2, "name": "Bob", ...},
    ...
  ]
}`}
              </div>
            </div>

            <div className="comparison-card fade-in">
              <div className="comparison-label">MINOTE Tokens</div>
              <div className="comparison-value">348</div>
              <div className="comparison-code">
{`query: SELECT * FROM ...
rows
  | id   | name    | ... |
  | 1    | Alice   | ... |
  | 2    | Bob     | ... |
  ...`}
              </div>
            </div>

            <div className="comparison-card fade-in">
              <div className="comparison-label">Token Reduction</div>
              <div className="comparison-value">61%</div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-md)' }}>
                Save up to 61% on tokens with automatic table optimization for
                database results and uniform data structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
            Powerful Features
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
            Everything you need for efficient LLM data serialization
          </p>

          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Zero Dependencies</h3>
              <p className="feature-description">
                Lightweight and fast with no external dependencies.
                Perfect for any TypeScript/JavaScript project.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Type-Safe</h3>
              <p className="feature-description">
                Full TypeScript support with complete type inference.
                Catch errors at compile-time, not runtime.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Table Optimization</h3>
              <p className="feature-description">
                Automatically converts uniform arrays to compact table format.
                Achieves 60%+ savings for database results.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Bidirectional</h3>
              <p className="feature-description">
                Lossless conversion between JSON and MINOTE.
                Perfect roundtrip preservation of all data types.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Smart Formatting</h3>
              <p className="feature-description">
                Intelligent indentation and type preservation.
                Human-readable output that LLMs understand perfectly.
              </p>
            </div>

            <div className="feature-card fade-in">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Cost Savings</h3>
              <p className="feature-description">
                Reduce LLM API costs by up to 61% on token-heavy workloads.
                Same data, fraction of the cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases" style={{ padding: 'var(--space-3xl) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
            Perfect For
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
            MINOTE shines in these common scenarios
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Database Results</h3>
              <p className="feature-description">
                Transform SQL query results into compact table format.
                Perfect for feeding database data to LLMs.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">API Responses</h3>
              <p className="feature-description">
                Compress API responses before sending to LLMs.
                Reduce context window usage dramatically.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">ML Training Data</h3>
              <p className="feature-description">
                Efficiently represent training samples and features.
                Save costs when processing large datasets with LLMs.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Configuration Files</h3>
              <p className="feature-description">
                Store configs in a more readable format.
                Better for both humans and language models.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Analytics Logs</h3>
              <p className="feature-description">
                Compress event logs and time-series data.
                Maintain structure while minimizing tokens.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">LLM Prompts</h3>
              <p className="feature-description">
                Include more context in your prompts.
                Fit more data within token limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-lg)' }}>
            Ready to Save Tokens?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Try MINOTE in the interactive playground or dive into the documentation.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/playground" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: 'var(--space-lg) var(--space-2xl)' }}>
              Open Playground
            </Link>
            <Link to="/examples" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: 'var(--space-lg) var(--space-2xl)' }}>
              View Examples
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
