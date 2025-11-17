import { useState, useEffect } from 'react'
import Playground from '../components/Playground'
import { examples, Example } from '../lib/examples'

export default function PlaygroundPage() {
  const [selectedExample, setSelectedExample] = useState<Example>(examples[0])
  const [jsonInput, setJsonInput] = useState('')

  useEffect(() => {
    // Format the selected example data as JSON
    setJsonInput(JSON.stringify(selectedExample.data, null, 2))
  }, [selectedExample])

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const example = examples.find((ex) => ex.id === e.target.value)
    if (example) {
      setSelectedExample(example)
    }
  }

  return (
    <div className="page">
      <div className="container-wide">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Interactive Playground</h1>
          <p className="page-subtitle">
            Try MINOTE in real-time. Convert between JSON and MINOTE with live token counting.
          </p>
        </div>

        {/* Example Selector */}
        <div className="playground-header">
          <div className="example-selector-container">
            <label htmlFor="example-select" className="example-label">
              Try an Example:
            </label>
            <select
              id="example-select"
              className="example-select"
              value={selectedExample.id}
              onChange={handleExampleChange}
            >
              {examples.map((example) => (
                <option key={example.id} value={example.id}>
                  {example.title} - {example.category} ({example.reduction}% reduction)
                </option>
              ))}
            </select>
          </div>

          <div className="example-info">
            <p className="example-description">{selectedExample.description}</p>
            <div className="example-quick-stats">
              <span className="quick-stat">
                <strong>Category:</strong> {selectedExample.category}
              </span>
              <span className="quick-stat">
                <strong>Expected Savings:</strong>{' '}
                <span className="gradient-text">{selectedExample.reduction}%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Playground */}
        <div className="playground-wrapper">
          <Playground
            key={selectedExample.id}
            initialJson={jsonInput}
            onJsonChange={(json) => setJsonInput(json)}
          />
        </div>

        {/* Tips */}
        <div className="tips-section">
          <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
            Tips:
          </h3>
          <ul className="tips-list">
            <li>
              <strong>Toggle Direction:</strong> Click the direction button to switch between
              JSON→MINOTE and MINOTE→JSON conversion modes.
            </li>
            <li>
              <strong>Live Preview:</strong> Changes are reflected in real-time with a short debounce
              for smooth editing.
            </li>
            <li>
              <strong>Copy Output:</strong> Use the copy buttons in each pane to copy the converted
              output to your clipboard.
            </li>
            <li>
              <strong>Table Format:</strong> Notice how arrays of uniform objects are automatically
              converted to compact table format in MINOTE.
            </li>
            <li>
              <strong>Type Preservation:</strong> All JSON types (strings, numbers, booleans, null)
              are preserved during conversion.
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .playground-header {
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .example-selector-container {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .example-label {
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .example-select {
          flex: 1;
          padding: var(--space-md) var(--space-lg);
          background: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 1rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .example-select:hover {
          border-color: var(--accent-blue);
        }

        .example-select:focus {
          outline: none;
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .example-info {
          padding-top: var(--space-lg);
          border-top: 1px solid var(--border-color);
        }

        .example-description {
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
          font-size: 0.9375rem;
        }

        .example-quick-stats {
          display: flex;
          gap: var(--space-xl);
          flex-wrap: wrap;
        }

        .quick-stat {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .quick-stat strong {
          color: var(--text-primary);
          margin-right: var(--space-xs);
        }

        .playground-wrapper {
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          min-height: 600px;
          box-shadow: var(--shadow-lg);
        }

        .tips-section {
          margin-top: var(--space-2xl);
          padding: var(--space-xl);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }

        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .tips-list li {
          padding-left: var(--space-lg);
          position: relative;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .tips-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--accent-blue);
          font-weight: bold;
        }

        .tips-list li strong {
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .example-selector-container {
            flex-direction: column;
            align-items: stretch;
          }

          .example-label {
            text-align: left;
          }

          .example-quick-stats {
            flex-direction: column;
            gap: var(--space-sm);
          }
        }
      `}</style>
    </div>
  )
}
