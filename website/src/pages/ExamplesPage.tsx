import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { examples } from '../lib/examples'
import { toMinote } from 'minote'

export default function ExamplesPage() {
  const navigate = useNavigate()
  const [expandedExample, setExpandedExample] = useState<string | null>(null)

  const handleExampleClick = (exampleId: string) => {
    // Navigate to playground with this example pre-loaded
    navigate(`/playground?example=${exampleId}`)
  }

  const toggleExpanded = (exampleId: string) => {
    setExpandedExample(expandedExample === exampleId ? null : exampleId)
  }

  return (
    <div className="page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Example Gallery</h1>
          <p className="page-subtitle">
            Explore real-world examples demonstrating MINOTE's token-saving capabilities.
            Click any example to try it in the playground.
          </p>
        </div>

        {/* Examples Grid */}
        <div className="examples-container">
          {examples.map((example, index) => {
            const minoteVersion = toMinote(example.data)
            const jsonVersion = JSON.stringify(example.data, null, 2)
            const isExpanded = expandedExample === example.id

            return (
              <div
                key={example.id}
                className="example-card fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Example Header */}
                <div className="example-header">
                  <div>
                    <h3 className="example-title">{example.title}</h3>
                    <p className="example-description">{example.description}</p>
                  </div>
                  <div className="example-badge">{example.reduction}% Savings</div>
                </div>

                {/* Stats */}
                <div className="example-stats">
                  <div className="example-stat">
                    <div className="example-stat-label">Category</div>
                    <div className="example-stat-value">{example.category}</div>
                  </div>
                  <div className="example-stat">
                    <div className="example-stat-label">JSON Tokens</div>
                    <div className="example-stat-value">{example.jsonTokens}</div>
                  </div>
                  <div className="example-stat">
                    <div className="example-stat-label">MINOTE Tokens</div>
                    <div className="example-stat-value">{example.minoteTokens}</div>
                  </div>
                  <div className="example-stat">
                    <div className="example-stat-label">Reduction</div>
                    <div className="example-stat-value gradient-text">{example.reduction}%</div>
                  </div>
                </div>

                {/* Preview Toggle */}
                <button
                  className="preview-toggle-btn"
                  onClick={() => toggleExpanded(example.id)}
                >
                  {isExpanded ? 'Hide Preview' : 'Show Preview'}
                </button>

                {/* Preview Content */}
                {isExpanded && (
                  <div className="example-preview">
                    <div className="preview-pane">
                      <div className="preview-header">
                        <span className="preview-label">JSON ({example.jsonTokens} tokens)</span>
                      </div>
                      <pre className="preview-code">
                        <code>{jsonVersion}</code>
                      </pre>
                    </div>

                    <div className="preview-divider">→</div>

                    <div className="preview-pane">
                      <div className="preview-header">
                        <span className="preview-label">MINOTE ({example.minoteTokens} tokens)</span>
                      </div>
                      <pre className="preview-code">
                        <code>{minoteVersion}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 'var(--space-md)' }}
                  onClick={() => handleExampleClick(example.id)}
                >
                  Try in Playground →
                </button>
              </div>
            )
          })}
        </div>

        {/* Summary Section */}
        <section className="summary-section">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            Why These Examples Matter
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Real-World Data</h3>
              <p className="feature-description">
                These examples represent actual use cases you'll encounter when working with LLMs:
                API responses, database results, ML data, and more.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Proven Savings</h3>
              <p className="feature-description">
                Average 47% token reduction across all examples, with database and ML examples
                achieving up to 61% savings through table optimization.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Perfect Roundtrips</h3>
              <p className="feature-description">
                Every example demonstrates lossless conversion. All data types, values, and
                structure are preserved perfectly in both directions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)', padding: 'var(--space-2xl)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Ready to Try MINOTE?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Jump into the interactive playground to experiment with these examples and your own data.
          </p>
          <button
            className="btn btn-primary"
            style={{ fontSize: '1.125rem', padding: 'var(--space-lg) var(--space-2xl)' }}
            onClick={() => navigate('/playground')}
          >
            Open Playground
          </button>
        </div>
      </div>

      <style>{`
        .examples-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .preview-toggle-btn {
          width: 100%;
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-top: var(--space-md);
        }

        .preview-toggle-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent-blue);
        }

        .example-preview {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--space-md);
          margin-top: var(--space-lg);
          padding: var(--space-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          animation: fadeIn var(--transition-base) ease-out;
        }

        .preview-pane {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
          padding-bottom: var(--space-sm);
          border-bottom: 1px solid var(--border-color);
        }

        .preview-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .preview-code {
          flex: 1;
          margin: 0;
          padding: var(--space-md);
          background: var(--code-bg);
          border-radius: var(--radius-sm);
          overflow-x: auto;
          font-size: 0.75rem;
          line-height: 1.6;
        }

        .preview-code code {
          background: none;
          border: none;
          padding: 0;
          color: var(--code-text);
        }

        .preview-divider {
          display: flex;
          align-items: center;
          color: var(--accent-blue);
          font-size: 1.5rem;
          font-weight: bold;
        }

        .summary-section {
          margin-top: var(--space-3xl);
          padding: var(--space-3xl) 0;
          border-top: 2px solid var(--border-color);
        }

        @media (max-width: 1024px) {
          .example-preview {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }

          .preview-divider {
            justify-content: center;
            transform: rotate(90deg);
          }
        }

        @media (max-width: 768px) {
          .preview-code {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  )
}
