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

// Import MINOTE functions
import { toMinote, toJson } from 'minote';

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
  'nested-test': {
    name: 'Nested Test',
    json: JSON.stringify({
      user: {
        id: 123,
        profile: {
          name: 'Alice',
          settings: {
            theme: 'dark',
            notifications: true
          }
        },
        stats: {
          score: 100,
          badges: ['gold', 'silver']
        }
      }
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
  'ecommerce-products': {
    name: 'E-commerce Products',
    json: JSON.stringify({
      products: [
        {
          id: 'PRD001',
          name: 'Wireless Bluetooth Headphones',
          category: 'Electronics',
          price: 89.99,
          currency: 'USD',
          inStock: true,
          stock: 45,
          images: ['headphones1.jpg', 'headphones2.jpg'],
          specifications: {
            color: 'Black',
            weight: '250g',
            battery: '30 hours',
            connectivity: 'Bluetooth 5.0'
          },
          reviews: [
            { rating: 5, comment: 'Excellent sound quality!' },
            { rating: 4, comment: 'Good value for money' }
          ]
        },
        {
          id: 'PRD002',
          name: 'Smart Watch Pro',
          category: 'Wearables',
          price: 299.99,
          currency: 'USD',
          inStock: true,
          stock: 12,
          images: ['watch1.jpg'],
          specifications: {
            display: '1.4" AMOLED',
            battery: '7 days',
            waterResistant: 'IP68',
            features: ['Heart rate', 'GPS', 'Sleep tracking']
          },
          reviews: [
            { rating: 5, comment: 'Love the battery life!' },
            { rating: 3, comment: 'A bit expensive' }
          ]
        }
      ]
    }, null, 2),
  },
  'social-media-feed': {
    name: 'Social Media Feed',
    json: JSON.stringify({
      feed: {
        user: {
          id: 'user123',
          username: 'tech_enthusiast',
          displayName: 'Tech Enthusiast',
          avatar: 'avatar.jpg',
          verified: true,
          followers: 15420,
          following: 892
        },
        posts: [
          {
            id: 'post001',
            content: 'Just discovered an amazing AI tool that can reduce JSON size by 60%! 🤯',
            timestamp: '2024-01-15T14:30:00Z',
            likes: 342,
            comments: 28,
            shares: 56,
            hashtags: ['#AI', '#JSON', 'DataOptimization'],
            media: {
              type: 'image',
              url: 'post1.jpg',
              alt: 'AI tool screenshot'
            }
          },
          {
            id: 'post002',
            content: 'Working on a new project that uses MINOTE notation for efficient data storage. The results are impressive!',
            timestamp: '2024-01-14T09:15:00Z',
            likes: 189,
            comments: 15,
            shares: 23,
            hashtags: ['#MINOTE', '#DataScience', 'Innovation'],
            poll: {
              question: 'Which data format do you prefer?',
              options: ['JSON', 'MINOTE', 'XML', 'YAML'],
              votes: [245, 189, 45, 67]
            }
          }
        ]
      }
    }, null, 2),
  },
  'financial-data': {
    name: 'Financial Portfolio',
    json: JSON.stringify({
      portfolio: {
        clientId: 'CL789456',
        clientName: 'Sarah Johnson',
        advisor: 'Michael Chen',
        totalValue: 1250000.50,
        currency: 'USD',
        lastUpdated: '2024-01-15T16:00:00Z',
        assets: [
          {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            type: 'stock',
            quantity: 150,
            avgPrice: 145.67,
            currentPrice: 192.53,
            value: 28879.50,
            gain: 7029.00,
            gainPercent: 32.17
          },
          {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            type: 'stock',
            quantity: 50,
            avgPrice: 2450.00,
            currentPrice: 2812.45,
            value: 140622.50,
            gain: 18122.50,
            gainPercent: 14.79
          },
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'cryptocurrency',
            quantity: 0.5,
            avgPrice: 35000.00,
            currentPrice: 42500.00,
            value: 21250.00,
            gain: 3750.00,
            gainPercent: 21.43
          }
        ],
        allocations: {
          stocks: 65.5,
          bonds: 20.0,
          realEstate: 10.0,
          cryptocurrencies: 4.5
        },
        performance: {
          ytd: 12.4,
          oneYear: 18.7,
          threeYear: 45.2,
          fiveYear: 89.3
        }
      }
    }, null, 2),
  },
  'iot-sensors': {
    name: 'IoT Sensor Network',
    json: JSON.stringify({
      network: {
        id: 'NET001',
        name: 'Smart Building Sensors',
        location: 'Tech Hub Downtown',
        timezone: 'America/New_York',
        sensors: [
          {
            id: 'TEMP001',
            type: 'temperature',
            location: 'Floor 1 - Lobby',
            status: 'active',
            battery: 87,
            lastSeen: '2024-01-15T16:05:00Z',
            readings: [
              { timestamp: '2024-01-15T16:00:00Z', value: 22.5, unit: 'Celsius' },
              { timestamp: '2024-01-15T16:01:00Z', value: 22.7, unit: 'Celsius' },
              { timestamp: '2024-01-15T16:02:00Z', value: 22.6, unit: 'Celsius' },
              { timestamp: '2024-01-15T16:03:00Z', value: 22.8, unit: 'Celsius' },
              { timestamp: '2024-01-15T16:04:00Z', value: 22.4, unit: 'Celsius' }
            ],
            thresholds: { min: 18.0, max: 26.0, critical: { min: 15.0, max: 30.0 } }
          },
          {
            id: 'HUMID001',
            type: 'humidity',
            location: 'Floor 1 - Lobby',
            status: 'active',
            battery: 92,
            lastSeen: '2024-01-15T16:05:00Z',
            readings: [
              { timestamp: '2024-01-15T16:00:00Z', value: 45.2, unit: '%' },
              { timestamp: '2024-01-15T16:01:00Z', value: 45.5, unit: '%' },
              { timestamp: '2024-01-15T16:02:00Z', value: 45.3, unit: '%' },
              { timestamp: '2024-01-15T16:03:00Z', value: 45.7, unit: '%' },
              { timestamp: '2024-01-15T16:04:00Z', value: 45.1, unit: '%' }
            ],
            thresholds: { min: 30.0, max: 60.0, critical: { min: 20.0, max: 70.0 } }
          },
          {
            id: 'MOTION001',
            type: 'motion',
            location: 'Floor 2 - Conference Room A',
            status: 'active',
            battery: 78,
            lastSeen: '2024-01-15T16:04:00Z',
            readings: [
              { timestamp: '2024-01-15T16:00:00Z', value: false, unit: 'binary' },
              { timestamp: '2024-01-15T16:01:00Z', value: false, unit: 'binary' },
              { timestamp: '2024-01-15T16:02:00Z', value: true, unit: 'binary' },
              { timestamp: '2024-01-15T16:03:00Z', value: true, unit: 'binary' },
              { timestamp: '2024-01-15T16:04:00Z', value: false, unit: 'binary' }
            ]
          }
        ],
        alerts: [
          {
            id: 'ALERT001',
            sensorId: 'TEMP001',
            type: 'threshold_warning',
            message: 'Temperature approaching upper threshold',
            severity: 'warning',
            timestamp: '2024-01-15T15:45:00Z',
            acknowledged: false
          }
        ]
      }
    }, null, 2),
  },
  'gaming-data': {
    name: 'Gaming Leaderboard',
    json: JSON.stringify({
      game: {
        id: 'GAME001',
        name: 'Space Warriors',
        version: '2.4.1',
        maxPlayers: 100,
        gameMode: 'battle_royale',
        map: 'Cosmic Arena',
        season: 5,
        seasonEnd: '2024-03-01T00:00:00Z'
      },
      leaderboard: {
        lastUpdated: '2024-01-15T16:00:00Z',
        refreshInterval: 300,
        players: [
          {
            rank: 1,
            playerId: 'P1001',
            username: 'ProGamer2024',
            level: 87,
            experience: 2456789,
            kda: { kills: 3421, deaths: 892, assists: 2105 },
            winRate: 68.4,
            totalGames: 1847,
            achievements: [
              { id: 'ACH001', name: 'First Blood', unlocked: '2023-01-15T10:30:00Z' },
              { id: 'ACH023', name: 'Sharpshooter', unlocked: '2023-06-22T14:20:00Z' },
              { id: 'ACH045', name: 'Team Player', unlocked: '2023-09-10T18:45:00Z' }
            ],
            loadout: {
              primary: 'Plasma Rifle',
              secondary: 'Pistol',
              special: 'Grenade Launcher',
              melee: 'Energy Sword'
            },
            stats: {
              accuracy: 72.3,
              headshotPercent: 41.7,
              avgSurvivalTime: 847,
              longestKillStreak: 18
            }
          },
          {
            rank: 2,
            playerId: 'P2045',
            username: 'NinjaWarrior',
            level: 85,
            experience: 2345678,
            kda: { kills: 3892, deaths: 1234, assists: 1876 },
            winRate: 65.2,
            totalGames: 2156,
            achievements: [
              { id: 'ACH001', name: 'First Blood', unlocked: '2023-02-20T09:15:00Z' },
              { id: 'ACH028', name: 'Speed Demon', unlocked: '2023-07-18T16:30:00Z' }
            ],
            loadout: {
              primary: 'Sniper Rifle',
              secondary: 'SMG',
              special: 'Smoke Grenade',
              melee: 'Combat Knife'
            },
            stats: {
              accuracy: 68.9,
              headshotPercent: 38.2,
              avgSurvivalTime: 765,
              longestKillStreak: 22
            }
          },
          {
            rank: 3,
            playerId: 'P3333',
            username: 'CyberKnight',
            level: 83,
            experience: 2234567,
            kda: { kills: 3123, deaths: 987, assists: 2341 },
            winRate: 64.8,
            totalGames: 1987,
            achievements: [
              { id: 'ACH012', name: 'Tank Destroyer', unlocked: '2023-04-05T13:20:00Z' },
              { id: 'ACH033', name: 'Medic', unlocked: '2023-08-12T11:45:00Z' }
            ],
            loadout: {
              primary: 'Heavy Machine Gun',
              secondary: 'Shotgun',
              special: 'Health Pack',
              melee: 'War Hammer'
            },
            stats: {
              accuracy: 75.1,
              headshotPercent: 35.6,
              avgSurvivalTime: 912,
              longestKillStreak: 15
            }
          }
        ]
      }
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
  const [leftContent, setLeftContent] = useState(examples['simple-object'].json);
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
        const minote = toMinote(parsed);
        setRightContent(minote);
      } else {
        const json = toJson(leftContent, true);
        setRightContent(json);
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
    setLeftContent(examples['simple-object'].json);
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
              <Select onValueChange={loadExample} defaultValue="simple-object">
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