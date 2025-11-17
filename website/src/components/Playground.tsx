import { useState, useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { toMinote, toJson } from 'minote'

interface PlaygroundProps {
  initialJson?: string
  initialMinote?: string
  onJsonChange?: (json: string) => void
  onMinoteChange?: (minote: string) => void
}

export default function Playground({
  initialJson = '',
  initialMinote = '',
  onJsonChange,
  onMinoteChange,
}: PlaygroundProps) {
  const [jsonInput, setJsonInput] = useState(initialJson)
  const [minoteOutput, setMinoteOutput] = useState(initialMinote)
  const [direction, setDirection] = useState<'json-to-minote' | 'minote-to-json'>('json-to-minote')
  const [error, setError] = useState<string>('')
  const [jsonTokens, setJsonTokens] = useState(0)
  const [minoteTokens, setMinoteTokens] = useState(0)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')

  // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
  const estimateTokens = (text: string): number => {
    return Math.ceil(text.length / 4)
  }

  // Convert JSON to MINOTE
  const convertJsonToMinote = useCallback((json: string) => {
    if (!json.trim()) {
      setMinoteOutput('')
      setJsonTokens(0)
      setMinoteTokens(0)
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(json)
      const minote = toMinote(parsed)
      setMinoteOutput(minote)
      setJsonTokens(estimateTokens(json))
      setMinoteTokens(estimateTokens(minote))
      setError('')
      if (onMinoteChange) onMinoteChange(minote)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setMinoteOutput('')
    }
  }, [onMinoteChange])

  // Convert MINOTE to JSON
  const convertMinoteToJson = useCallback((minote: string) => {
    if (!minote.trim()) {
      setJsonInput('')
      setJsonTokens(0)
      setMinoteTokens(0)
      setError('')
      return
    }

    try {
      const json = toJson(minote)
      const formatted = JSON.stringify(json, null, 2)
      setJsonInput(formatted)
      setJsonTokens(estimateTokens(formatted))
      setMinoteTokens(estimateTokens(minote))
      setError('')
      if (onJsonChange) onJsonChange(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid MINOTE')
      setJsonInput('')
    }
  }, [onJsonChange])

  // Handle JSON editor change
  const handleJsonChange = (value: string | undefined) => {
    const newValue = value || ''
    setJsonInput(newValue)
    if (direction === 'json-to-minote') {
      // Debounce conversion
      const timeoutId = setTimeout(() => {
        convertJsonToMinote(newValue)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }

  // Handle MINOTE editor change
  const handleMinoteChange = (value: string | undefined) => {
    const newValue = value || ''
    setMinoteOutput(newValue)
    if (direction === 'minote-to-json') {
      // Debounce conversion
      const timeoutId = setTimeout(() => {
        convertMinoteToJson(newValue)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }

  // Toggle direction
  const toggleDirection = () => {
    const newDirection = direction === 'json-to-minote' ? 'minote-to-json' : 'json-to-minote'
    setDirection(newDirection)
    setError('')

    if (newDirection === 'minote-to-json' && minoteOutput) {
      convertMinoteToJson(minoteOutput)
    } else if (newDirection === 'json-to-minote' && jsonInput) {
      convertJsonToMinote(jsonInput)
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: 'json' | 'minote') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Calculate savings percentage
  const savingsPercentage = jsonTokens > 0
    ? Math.round(((jsonTokens - minoteTokens) / jsonTokens) * 100)
    : 0

  // Initialize with initial values
  useEffect(() => {
    if (initialJson) {
      setJsonInput(initialJson)
      convertJsonToMinote(initialJson)
    }
  }, [initialJson, convertJsonToMinote])

  return (
    <div className="playground">
      {/* Controls */}
      <div className="playground-controls">
        <div className="control-group">
          <button
            className={`btn btn-small ${direction === 'json-to-minote' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={toggleDirection}
          >
            {direction === 'json-to-minote' ? 'JSON → MINOTE' : 'MINOTE → JSON'}
          </button>
        </div>

        {/* Token Counter */}
        <div className="token-stats">
          <div className="stat-item">
            <span className="stat-label">JSON</span>
            <span className="stat-value">{jsonTokens}</span>
          </div>
          <div className="stat-divider">→</div>
          <div className="stat-item">
            <span className="stat-label">MINOTE</span>
            <span className="stat-value">{minoteTokens}</span>
          </div>
          {savingsPercentage > 0 && (
            <>
              <div className="stat-divider">=</div>
              <div className="stat-item stat-savings">
                <span className="stat-label">Savings</span>
                <span className="stat-value">{savingsPercentage}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}

      {/* Editors */}
      <div className="split-pane">
        {/* JSON Editor */}
        <div className="pane">
          <div className="pane-header">
            <h3 className="pane-title">JSON</h3>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(jsonInput, 'json')}
              disabled={!jsonInput}
            >
              {copyStatus === 'copied' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="pane-content">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={jsonInput}
              onChange={handleJsonChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                readOnly: direction === 'minote-to-json',
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* MINOTE Editor */}
        <div className="pane">
          <div className="pane-header">
            <h3 className="pane-title">MINOTE</h3>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(minoteOutput, 'minote')}
              disabled={!minoteOutput}
            >
              {copyStatus === 'copied' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="pane-content">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              value={minoteOutput}
              onChange={handleMinoteChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                readOnly: direction === 'json-to-minote',
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .playground {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          height: 100%;
        }

        .playground-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          background: var(--bg-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
        }

        .control-group {
          display: flex;
          gap: var(--space-sm);
          align-items: center;
        }

        .token-stats {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-savings .stat-value {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-divider {
          color: var(--text-tertiary);
          font-size: 1.25rem;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: var(--radius-md);
          color: var(--error);
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .error-message {
          flex: 1;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .playground-controls {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-md);
          }

          .token-stats {
            justify-content: space-around;
            width: 100%;
          }

          .stat-item {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}
