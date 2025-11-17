import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FeatureCard } from '../components/FeatureCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CodeBlock } from '../components/CodeBlock';
import {
  Zap,
  Package,
  TrendingDown,
  FileCode,
  Sparkles,
  Rocket,
  Shield,
  Boxes,
  ArrowRight,
  Play,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 animated-gradient opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(0,0,0,0))]" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="animate-fade-in">
              <Badge variant="info" className="text-sm px-4 py-2">
                <Sparkles className="w-3 h-3 mr-2 inline" />
                Zero Dependencies - Pure TypeScript
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
              <span className="gradient-text">Compress JSON</span>
              <br />
              <span className="text-foreground">By Up To 47%</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              MINOTE is a minimal notation format that dramatically reduces JSON token count
              for LLM context windows while maintaining full reversibility.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/playground">
                <Button size="xl" variant="gradient" className="gap-2 glow-purple">
                  <Play className="w-5 h-5" />
                  Try Playground
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="xl" variant="outline" className="gap-2">
                  View Documentation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
              <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
                <div className="text-4xl font-bold gradient-text mb-2">47%</div>
                <div className="text-sm text-muted-foreground">Average Token Savings</div>
              </div>
              <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
                <div className="text-4xl font-bold gradient-text mb-2">0</div>
                <div className="text-sm text-muted-foreground">Dependencies</div>
              </div>
              <div className="bg-card/50 backdrop-blur border rounded-lg p-6">
                <div className="text-4xl font-bold gradient-text mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Reversible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See The <span className="gradient-text">Difference</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Watch tokens disappear in real-time
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before: JSON */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Standard JSON</h3>
                  <Badge variant="destructive">124 tokens</Badge>
                </div>
                <CodeBlock
                  language="json"
                  code={`{
  "users": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "active": true
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "role": "user",
      "active": true
    }
  ]
}`}
                />
              </div>

              {/* After: MINOTE */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">MINOTE Format</h3>
                  <Badge variant="success">66 tokens (-47%)</Badge>
                </div>
                <CodeBlock
                  language="minote"
                  code={`users:
#id,name,email,role,active
1,Alice Johnson,alice@example.com,admin,t
2,Bob Smith,bob@example.com,user,t`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why <span className="gradient-text">MINOTE</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for optimizing LLM context windows without sacrificing data integrity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={TrendingDown}
                title="Massive Token Savings"
                description="Reduce JSON tokens by up to 47% on average. Perfect for staying within LLM context limits."
                gradient="from-green-500/10 to-emerald-500/10"
              />
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Optimized for speed with zero dependencies. Parse and generate MINOTE in milliseconds."
                gradient="from-yellow-500/10 to-orange-500/10"
              />
              <FeatureCard
                icon={Shield}
                title="100% Reversible"
                description="Perfectly convert between JSON and MINOTE without any data loss. Full bidirectional support."
                gradient="from-blue-500/10 to-cyan-500/10"
              />
              <FeatureCard
                icon={Package}
                title="Zero Dependencies"
                description="Pure TypeScript implementation. No external dependencies means smaller bundle size and fewer security risks."
                gradient="from-purple-500/10 to-pink-500/10"
              />
              <FeatureCard
                icon={FileCode}
                title="Type Safe"
                description="Written in TypeScript with full type definitions. Catch errors at compile time, not runtime."
                gradient="from-indigo-500/10 to-blue-500/10"
              />
              <FeatureCard
                icon={Boxes}
                title="Array Optimization"
                description="Automatically detects and optimizes arrays of objects with shared keys into table format."
                gradient="from-red-500/10 to-rose-500/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Perfect For <span className="gradient-text">Every Use Case</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    LLM Context Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Fit more data into your LLM prompts. Perfect for RAG systems, chatbots,
                    and AI agents that need to process large datasets.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    API Response Compression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Reduce bandwidth costs and improve response times for mobile apps
                    and bandwidth-constrained environments.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Data Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Store more data in the same space. Ideal for edge devices, embedded
                    systems, and cost-sensitive cloud storage.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Log File Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Compress structured logs while maintaining searchability and readability.
                    Perfect for high-volume logging systems.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started in <span className="gradient-text">Seconds</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Install</h3>
                <CodeBlock
                  language="bash"
                  code="npm install minote"
                  showLineNumbers={false}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Use</h3>
                <CodeBlock
                  language="typescript"
                  code={`import { jsonToMinote, minoteToJson } from 'minote';

// Compress JSON to MINOTE
const minote = jsonToMinote(yourData);

// Decompress back to JSON
const json = minoteToJson(minote);`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to <span className="gradient-text">Optimize</span>?
            </h2>
            <p className="text-xl text-muted-foreground">
              Start saving tokens and money today with MINOTE
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/playground">
                <Button size="xl" variant="gradient" className="gap-2 glow-purple">
                  <Rocket className="w-5 h-5" />
                  Try Playground Now
                </Button>
              </Link>
              <a href="https://github.com/cksachdev/minote" target="_blank" rel="noopener noreferrer">
                <Button size="xl" variant="outline" className="gap-2">
                  View on GitHub
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
