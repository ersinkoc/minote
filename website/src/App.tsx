import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PlaygroundPage from './pages/PlaygroundPage'
import DocsPage from './pages/DocsPage'
import ExamplesPage from './pages/ExamplesPage'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              <span className="logo-icon">💎</span>
              <span className="logo-text">MINOTE</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/playground" className="nav-link">Playground</Link>
              <Link to="/docs" className="nav-link">API Docs</Link>
              <Link to="/examples" className="nav-link">Examples</Link>
              <a
                href="https://github.com/ersinkoc/minote"
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/examples" element={<ExamplesPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>© 2025 MINOTE - MIT License</p>
            <p>Less tokens, more intelligence 🚀</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
