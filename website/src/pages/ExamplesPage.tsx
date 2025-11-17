import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExampleCard } from '../components/ExampleCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { CodeBlock } from '../components/CodeBlock';
import { Database, Cloud, MessageSquare, FileJson, Filter } from 'lucide-react';

interface Example {
  id: string;
  title: string;
  description: string;
  category: string;
  savings: string;
  json: string;
  minote: string;
}

const examples: Example[] = [
  {
    id: 'user-profiles',
    title: 'User Profiles',
    description: 'Common user data structure with multiple fields',
    category: 'Database',
    savings: '47%',
    json: JSON.stringify({
      users: [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', active: true },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', active: true },
        { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', active: false },
      ],
    }, null, 2),
    minote: `users:
#id,name,email,role,active
1,Alice Johnson,alice@example.com,admin,t
2,Bob Smith,bob@example.com,user,t
3,Charlie Brown,charlie@example.com,user,f`,
  },
  {
    id: 'product-catalog',
    title: 'Product Catalog',
    description: 'E-commerce product listings with pricing and inventory',
    category: 'E-commerce',
    savings: '52%',
    json: JSON.stringify({
      products: [
        { sku: 'LAP-001', name: 'Gaming Laptop', price: 1299.99, stock: 15, featured: true },
        { sku: 'MOU-042', name: 'Wireless Mouse', price: 49.99, stock: 120, featured: false },
        { sku: 'KEY-017', name: 'Mechanical Keyboard', price: 159.99, stock: 45, featured: true },
      ],
    }, null, 2),
    minote: `products:
#sku,name,price,stock,featured
LAP-001,Gaming Laptop,1299.99,15,t
MOU-042,Wireless Mouse,49.99,120,f
KEY-017,Mechanical Keyboard,159.99,45,t`,
  },
  {
    id: 'chat-messages',
    title: 'Chat Messages',
    description: 'Messaging app conversation history',
    category: 'Communication',
    savings: '43%',
    json: JSON.stringify({
      messages: [
        { id: 'm1', sender: 'alice', text: 'Hey, how are you?', timestamp: 1704067200 },
        { id: 'm2', sender: 'bob', text: 'Great! Working on the project.', timestamp: 1704067260 },
        { id: 'm3', sender: 'alice', text: 'Awesome, need any help?', timestamp: 1704067320 },
      ],
    }, null, 2),
    minote: `messages:
#id,sender,text,timestamp
m1,alice,Hey\\, how are you?,1704067200
m2,bob,Great! Working on the project.,1704067260
m3,alice,Awesome\\, need any help?,1704067320`,
  },
  {
    id: 'api-logs',
    title: 'API Request Logs',
    description: 'Server logs with request details and response codes',
    category: 'Logs',
    savings: '55%',
    json: JSON.stringify({
      logs: [
        { timestamp: '2024-01-15T10:30:00Z', method: 'GET', path: '/api/users', status: 200, duration: 45 },
        { timestamp: '2024-01-15T10:31:12Z', method: 'POST', path: '/api/users', status: 201, duration: 123 },
        { timestamp: '2024-01-15T10:32:45Z', method: 'PUT', path: '/api/users/1', status: 200, duration: 67 },
      ],
    }, null, 2),
    minote: `logs:
#timestamp,method,path,status,duration
2024-01-15T10:30:00Z,GET,/api/users,200,45
2024-01-15T10:31:12Z,POST,/api/users,201,123
2024-01-15T10:32:45Z,PUT,/api/users/1,200,67`,
  },
  {
    id: 'iot-sensors',
    title: 'IoT Sensor Readings',
    description: 'Time-series data from IoT devices',
    category: 'IoT',
    savings: '49%',
    json: JSON.stringify({
      readings: [
        { deviceId: 'TH-001', temperature: 22.5, humidity: 45, battery: 87, online: true },
        { deviceId: 'TH-002', temperature: 23.1, humidity: 52, battery: 92, online: true },
        { deviceId: 'TH-003', temperature: 21.8, humidity: 48, battery: 34, online: false },
      ],
    }, null, 2),
    minote: `readings:
#deviceId,temperature,humidity,battery,online
TH-001,22.5,45,87,t
TH-002,23.1,52,92,t
TH-003,21.8,48,34,f`,
  },
  {
    id: 'task-management',
    title: 'Task Management',
    description: 'Project tasks with assignments and deadlines',
    category: 'Productivity',
    savings: '46%',
    json: JSON.stringify({
      tasks: [
        { id: 'T-101', title: 'Design homepage', assignee: 'Alice', priority: 'high', completed: false },
        { id: 'T-102', title: 'Write API docs', assignee: 'Bob', priority: 'medium', completed: true },
        { id: 'T-103', title: 'Fix login bug', assignee: 'Charlie', priority: 'urgent', completed: false },
      ],
    }, null, 2),
    minote: `tasks:
#id,title,assignee,priority,completed
T-101,Design homepage,Alice,high,f
T-102,Write API docs,Bob,medium,t
T-103,Fix login bug,Charlie,urgent,f`,
  },
  {
    id: 'financial-transactions',
    title: 'Financial Transactions',
    description: 'Banking transaction records',
    category: 'Finance',
    savings: '50%',
    json: JSON.stringify({
      transactions: [
        { txId: 'TX-9001', date: '2024-01-15', amount: 1250.00, type: 'credit', category: 'salary' },
        { txId: 'TX-9002', date: '2024-01-16', amount: 45.99, type: 'debit', category: 'groceries' },
        { txId: 'TX-9003', date: '2024-01-17', amount: 89.50, type: 'debit', category: 'utilities' },
      ],
    }, null, 2),
    minote: `transactions:
#txId,date,amount,type,category
TX-9001,2024-01-15,1250.00,credit,salary
TX-9002,2024-01-16,45.99,debit,groceries
TX-9003,2024-01-17,89.50,debit,utilities`,
  },
  {
    id: 'event-attendees',
    title: 'Event Attendees',
    description: 'Conference registration data',
    category: 'Events',
    savings: '44%',
    json: JSON.stringify({
      attendees: [
        { ticketId: 'E2024-001', name: 'Alice Johnson', company: 'TechCorp', vip: true, checkedIn: true },
        { ticketId: 'E2024-002', name: 'Bob Smith', company: 'StartupXYZ', vip: false, checkedIn: true },
        { ticketId: 'E2024-003', name: 'Charlie Brown', company: 'BigCo', vip: true, checkedIn: false },
      ],
    }, null, 2),
    minote: `attendees:
#ticketId,name,company,vip,checkedIn
E2024-001,Alice Johnson,TechCorp,t,t
E2024-002,Bob Smith,StartupXYZ,f,t
E2024-003,Charlie Brown,BigCo,t,f`,
  },
];

export default function ExamplesPage() {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(examples.map((e) => e.category)))];

  const handleTryExample = (example: Example) => {
    // In a real app, you'd pass this data to the playground via state or URL params
    navigate('/playground', { state: { example: example.json } });
  };

  const handleViewCode = (example: Example) => {
    setSelectedExample(example);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Examples</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-world use cases showing MINOTE in action
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400"
              >
                {category === 'All' && <Filter className="w-4 h-4 mr-2" />}
                {category === 'Database' && <Database className="w-4 h-4 mr-2" />}
                {category === 'Communication' && <MessageSquare className="w-4 h-4 mr-2" />}
                {category === 'Logs' && <FileJson className="w-4 h-4 mr-2" />}
                {category === 'IoT' && <Cloud className="w-4 h-4 mr-2" />}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examples
                  .filter((example) => category === 'All' || example.category === category)
                  .map((example) => (
                    <ExampleCard
                      key={example.id}
                      title={example.title}
                      description={example.description}
                      category={example.category}
                      savings={example.savings}
                      onTry={() => handleTryExample(example)}
                      onViewCode={() => handleViewCode(example)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Code View Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedExample && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedExample.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">JSON Format</h3>
                    <CodeBlock code={selectedExample.json} language="json" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">MINOTE Format</h3>
                    <CodeBlock code={selectedExample.minote} language="text" />
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-sm text-green-400 font-semibold">
                      Token Savings: {selectedExample.savings}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
