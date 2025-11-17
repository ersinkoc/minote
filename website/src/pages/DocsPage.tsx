import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CodeBlock } from '../components/CodeBlock';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { BookOpen, Code2, Lightbulb, Rocket } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about MINOTE
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">
              <Rocket className="w-4 h-4 mr-2" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="api">
              <Code2 className="w-4 h-4 mr-2" />
              API Reference
            </TabsTrigger>
            <TabsTrigger value="format">
              <BookOpen className="w-4 h-4 mr-2" />
              Format Spec
            </TabsTrigger>
            <TabsTrigger value="examples">
              <Lightbulb className="w-4 h-4 mr-2" />
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Installation</CardTitle>
                <CardDescription>Add MINOTE to your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">npm</h4>
                  <CodeBlock code="npm install minote" showLineNumbers={false} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">yarn</h4>
                  <CodeBlock code="yarn add minote" showLineNumbers={false} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">pnpm</h4>
                  <CodeBlock code="pnpm add minote" showLineNumbers={false} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Convert JSON to MINOTE and back</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock
                  language="typescript"
                  code={`import { jsonToMinote, minoteToJson } from 'minote';

// Your data
const data = {
  users: [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ]
};

// Convert to MINOTE (compressed)
const minote = jsonToMinote(data);
console.log(minote);
// Output:
// users:
// #id,name,email
// 1,Alice,alice@example.com
// 2,Bob,bob@example.com

// Convert back to JSON
const json = minoteToJson(minote);
console.log(json);
// Output: { users: [ { id: 1, name: "Alice", ... }, ... ] }`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TypeScript Support</CardTitle>
                <CardDescription>Full type definitions included</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`import { jsonToMinote, minoteToJson, MinoteOptions } from 'minote';

// Type-safe options
const options: MinoteOptions = {
  arrayThreshold: 3,
  indent: '  '
};

// Fully typed conversion
const minote: string = jsonToMinote(data, options);
const json: any = minoteToJson(minote);`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>jsonToMinote()</CardTitle>
                <CardDescription>Convert JSON to MINOTE format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Signature</h4>
                  <CodeBlock
                    language="typescript"
                    code={`function jsonToMinote(
  data: any,
  options?: MinoteOptions
): string`}
                    showLineNumbers={false}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Parameters</h4>
                  <div className="space-y-3 mt-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-sm font-mono">data</code>
                        <Badge>any</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The JSON data to convert. Can be any valid JSON structure.
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-sm font-mono">options</code>
                        <Badge variant="secondary">optional</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Conversion options:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <code className="bg-background px-2 py-0.5 rounded">arrayThreshold</code>
                          <span className="text-muted-foreground">
                            Minimum array length to use table format (default: 2)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <code className="bg-background px-2 py-0.5 rounded">indent</code>
                          <span className="text-muted-foreground">
                            Indentation string (default: 2 spaces)
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Returns</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge>string</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The MINOTE-formatted string representation of the input data.
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <CodeBlock
                    language="typescript"
                    code={`const data = { name: "Alice", age: 30 };
const minote = jsonToMinote(data);
// Output: "name:Alice\\nage:30"`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>minoteToJson()</CardTitle>
                <CardDescription>Convert MINOTE format back to JSON</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Signature</h4>
                  <CodeBlock
                    language="typescript"
                    code={`function minoteToJson(minote: string): any`}
                    showLineNumbers={false}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Parameters</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <code className="text-sm font-mono">minote</code>
                      <Badge>string</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The MINOTE-formatted string to parse.
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Returns</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge>any</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The parsed JSON data structure. The exact type depends on the input.
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <CodeBlock
                    language="typescript"
                    code={`const minote = "name:Alice\\nage:30";
const json = minoteToJson(minote);
// Output: { name: "Alice", age: 30 }`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Format Spec Tab */}
          <TabsContent value="format" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>MINOTE Format Specification</CardTitle>
                <CardDescription>Understanding the MINOTE syntax</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key-Value Pairs</h3>
                  <p className="text-muted-foreground mb-3">
                    Simple key-value pairs use colon notation:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">JSON</h4>
                      <CodeBlock
                        code={`{
  "name": "Alice",
  "age": 30
}`}
                        language="json"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">MINOTE</h4>
                      <CodeBlock
                        code={`name:Alice
age:30`}
                        language="text"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Nested Objects</h3>
                  <p className="text-muted-foreground mb-3">
                    Nested structures use indentation:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">JSON</h4>
                      <CodeBlock
                        code={`{
  "user": {
    "name": "Alice",
    "email": "alice@example.com"
  }
}`}
                        language="json"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">MINOTE</h4>
                      <CodeBlock
                        code={`user:
  name:Alice
  email:alice@example.com`}
                        language="text"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Arrays of Objects (Table Format)</h3>
                  <p className="text-muted-foreground mb-3">
                    Arrays with shared keys become tables with header rows (prefix: #):
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">JSON</h4>
                      <CodeBlock
                        code={`{
  "users": [
    {
      "id": 1,
      "name": "Alice"
    },
    {
      "id": 2,
      "name": "Bob"
    }
  ]
}`}
                        language="json"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">MINOTE</h4>
                      <CodeBlock
                        code={`users:
#id,name
1,Alice
2,Bob`}
                        language="text"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Boolean Values</h3>
                  <p className="text-muted-foreground mb-3">
                    Booleans are shortened to single characters:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-0.5 rounded">t</code>
                      <span className="text-muted-foreground">represents</span>
                      <code className="bg-muted px-2 py-0.5 rounded">true</code>
                    </li>
                    <li className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-0.5 rounded">f</code>
                      <span className="text-muted-foreground">represents</span>
                      <code className="bg-muted px-2 py-0.5 rounded">false</code>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Null Values</h3>
                  <p className="text-muted-foreground mb-3">
                    Null values are represented as empty or special markers:
                  </p>
                  <CodeBlock
                    code={`name:Alice
email:
active:t`}
                    language="text"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Use Cases</CardTitle>
                <CardDescription>Real-world examples of MINOTE usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">User Database Records</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Badge className="mb-2">JSON - 245 tokens</Badge>
                      <CodeBlock
                        code={`{
  "users": [
    {
      "id": 101,
      "username": "alice_j",
      "email": "alice@company.com",
      "role": "admin",
      "verified": true,
      "lastLogin": "2024-01-15"
    },
    {
      "id": 102,
      "username": "bob_smith",
      "email": "bob@company.com",
      "role": "user",
      "verified": true,
      "lastLogin": "2024-01-14"
    }
  ]
}`}
                        language="json"
                      />
                    </div>
                    <div>
                      <Badge variant="success" className="mb-2">MINOTE - 128 tokens (-48%)</Badge>
                      <CodeBlock
                        code={`users:
#id,username,email,role,verified,lastLogin
101,alice_j,alice@company.com,admin,t,2024-01-15
102,bob_smith,bob@company.com,user,t,2024-01-14`}
                        language="text"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">API Response Data</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Badge className="mb-2">JSON - 189 tokens</Badge>
                      <CodeBlock
                        code={`{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "P001",
        "name": "Laptop",
        "price": 999.99,
        "inStock": true
      },
      {
        "id": "P002",
        "name": "Mouse",
        "price": 29.99,
        "inStock": false
      }
    ]
  }
}`}
                        language="json"
                      />
                    </div>
                    <div>
                      <Badge variant="success" className="mb-2">MINOTE - 98 tokens (-48%)</Badge>
                      <CodeBlock
                        code={`status:success
data:
  products:
  #id,name,price,inStock
  P001,Laptop,999.99,t
  P002,Mouse,29.99,f`}
                        language="text"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
