import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PlaySquare, BookOpen, Code2, Github } from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

// Pages
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import DocsPage from './pages/DocsPage';
import ExamplesPage from './pages/ExamplesPage';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/playground', icon: PlaySquare, label: 'Playground' },
    { path: '/docs', icon: BookOpen, label: 'Docs' },
    { path: '/examples', icon: Code2, label: 'Examples' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold gradient-text">MINOTE</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'gap-2',
                      isActive && 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/cksachdev/minote"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </Button>
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2 flex-shrink-0',
                    isActive && 'bg-purple-500/10 text-purple-400'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-sm text-muted-foreground">
              MINOTE - Minimal Notation for Maximum Efficiency
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="https://github.com/cksachdev/minote" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/minote" className="hover:text-foreground transition-colors">
              npm
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen dark">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/examples" element={<ExamplesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
