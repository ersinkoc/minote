import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TokenCounter } from '../components/TokenCounter';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  ArrowLeftRight,
  Copy,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Import MINOTE functions (they should be available from the minote package)
import { jsonToMinote, minoteToJson } from 'minote';

const examples = {
  'simple-object': {
    name: 'Simple Object',
    json: JSON.stringify({
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      active: true,
    }, null, 2),
  },
  'array-of-objects': {
    name: 'Array of Users',
    json: JSON.stringify({
      users: [
        { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', active: true },
        { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', active: true },
        { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', active: false },
      ],
    }, null, 2),
  },
  'nested-structure': {
    name: 'Nested Structure',
    json: JSON.stringify({
      company: {
        name: 'TechCorp',
        employees: [
          { id: 1, name: 'Alice', department: 'Engineering' },
          { id: 2, name: 'Bob', department: 'Sales' },
        ],
        products: [
          { id: 101, name: 'Widget', price: 29.99, inStock: true },
          { id: 102, name: 'Gadget', price: 49.99, inStock: false },
        ],
      },
    }, null, 2),
  },
  'complex-data': {
    name: 'Complex Dataset',
    json: JSON.stringify({
      metadata: {
        version: '1.0',
        timestamp: '2024-01-15T10:30:00Z',
        source: 'api',
      },
      items: [
        { id: 1, title: 'First Item', tags: ['important', 'urgent'], count: 42 },
        { id: 2, title: 'Second Item', tags: ['review', 'pending'], count: 17 },
        { id: 3, title: 'Third Item', tags: ['completed'], count: 99 },
      ],
    }, null, 2),
  },
};

export default function PlaygroundPage() {
  const [direction, setDirection] = useState<'json-to-minote' | 'minote-to-json'>('json-to-minote');
  const [leftContent, setLeftContent] = useState(examples['array-of-objects'].json);
  const [rightContent, setRightContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [leftTokens, setLeftTokens] = useState(0);
  const [rightTokens, setRightTokens] = useState(0);

  // Simple token counter (rough estimate based on GPT tokenization)
  const estimateTokens = (text: string): number => {
    // Rough approximation: ~4 chars per token on average
    return Math.ceil(text.length / 4);
  };

  useEffect(() => {
    setLeftTokens(estimateTokens(leftContent));
    setRightTokens(estimateTokens(rightContent));
  }, [leftContent, rightContent]);

  const convert = () => {
    try {
      setError(null);
      if (direction === 'json-to-minote') {
        const parsed = JSON.parse(leftContent);
        const minote = jsonToMinote(parsed);
        setRightContent(minote);
      } else {
        const json = minoteToJson(leftContent);
        const formatted = JSON.stringify(json, null, 2);
        setRightContent(formatted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  };

  useEffect(() => {
    // Auto-convert on content change with debounce
    const timer = setTimeout(() => {
      if (leftContent.trim()) {
        convert();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [leftContent, direction]);

  const toggleDirection = () => {
    const newDirection = direction === 'json-to-minote' ? 'minote-to-json' : 'json-to-minote';
    setDirection(newDirection);
    // Swap contents
    const temp = leftContent;
    setLeftContent(rightContent);
    setRightContent(temp);
  };

  const loadExample = (exampleKey: string) => {
    const example = examples[exampleKey as keyof typeof examples];
    setDirection('json-to-minote');
    setLeftContent(example.json);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rightContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rightContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = direction === 'json-to-minote' ? 'output.minote' : 'output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setLeftContent(examples['array-of-objects'].json);
    setRightContent('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="gradient-text">Playground</span>
              </h1>
              <p className="text-muted-foreground">
                Convert between JSON and MINOTE in real-time
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select onValueChange={loadExample} defaultValue="array-of-objects">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Load example" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(examples).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Token Counter */}
        <TokenCounter
          jsonTokens={direction === 'json-to-minote' ? leftTokens : rightTokens}
          minoteTokens={direction === 'json-to-minote' ? rightTokens : leftTokens}
          className="mb-6"
        />

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Left Editor */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {direction === 'json-to-minote' ? (
                    <>
                      <Badge variant="destructive">Input</Badge>
                      JSON
                    </>
                  ) : (
                    <>
                      <Badge variant="info">Input</Badge>
                      MINOTE
                    </>
                  )}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {leftTokens.toLocaleString()} tokens
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Editor
                height="600px"
                language={direction === 'json-to-minote' ? 'json' : 'text'}
                value={leftContent}
                onChange={(value) => setLeftContent(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </CardContent>
          </Card>

          {/* Right Editor */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {direction === 'json-to-minote' ? (
                    <>
                      <Badge variant="success">Output</Badge>
                      MINOTE
                    </>
                  ) : (
                    <>
                      <Badge variant="success">Output</Badge>
                      JSON
                    </>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {rightTokens.toLocaleString()} tokens
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Editor
                height="600px"
                language={direction === 'json-to-minote' ? 'text' : 'json'}
                value={rightContent}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="gradient"
            onClick={toggleDirection}
            className="gap-2"
          >
            <ArrowLeftRight className="w-5 h-5" />
            Switch Direction
            <span className="text-xs opacity-80">
              ({direction === 'json-to-minote' ? 'JSON → MINOTE' : 'MINOTE → JSON'})
            </span>
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mt-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-destructive mb-1">Conversion Error</div>
                  <div className="text-sm text-muted-foreground">{error}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Auto-Convert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Changes are automatically converted after you stop typing (500ms delay)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Switch Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Toggle between JSON-to-MINOTE and MINOTE-to-JSON conversion modes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Load Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Try different examples to see how MINOTE handles various data structures
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
