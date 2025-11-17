/**
 * Example data for MINOTE website
 */

export interface Example {
  id: string
  title: string
  description: string
  category: string
  data: any
  jsonTokens: number
  minoteTokens: number
  reduction: number
}

export const examples: Example[] = [
  {
    id: 'basic-user',
    title: 'Basic User Object',
    description: 'Simple object with mixed types - shows basic MINOTE syntax',
    category: 'Basic',
    data: {
      name: 'Alice',
      age: 30,
      active: true,
      email: 'alice@example.com',
      role: 'admin',
    },
    jsonTokens: 89,
    minoteTokens: 47,
    reduction: 47,
  },
  {
    id: 'ecommerce-order',
    title: 'E-commerce Order',
    description: 'Complex nested structure with order details, customer info, and line items',
    category: 'API Response',
    data: {
      status: 'success',
      timestamp: 1700000000,
      data: {
        order: {
          id: 'ORD-2025-001',
          customer: {
            id: 'CUST-789',
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            tier: 'premium',
          },
          items: [
            {
              sku: 'LAPTOP-X1',
              name: 'UltraBook Pro',
              quantity: 1,
              price: 1299.99,
              tax: 104.0,
            },
            {
              sku: 'MOUSE-W2',
              name: 'Wireless Mouse',
              quantity: 2,
              price: 29.99,
              tax: 4.8,
            },
          ],
          shipping: {
            method: 'express',
            cost: 15.99,
            address: '123 Main St, San Francisco, CA 94102',
          },
          totals: {
            subtotal: 1359.97,
            tax: 108.8,
            shipping: 15.99,
            total: 1484.76,
          },
        },
      },
    },
    jsonTokens: 421,
    minoteTokens: 223,
    reduction: 47,
  },
  {
    id: 'database-results',
    title: 'Database Query Results',
    description: 'Employee records from database - demonstrates powerful table optimization (60%+ savings)',
    category: 'Database',
    data: {
      query: 'SELECT * FROM employees WHERE department = ?',
      params: ['Engineering'],
      rowCount: 5,
      rows: [
        {
          id: 1001,
          firstName: 'Alice',
          lastName: 'Chen',
          email: 'alice.chen@company.com',
          department: 'Engineering',
          title: 'Senior Engineer',
          salary: 150000,
          hireDate: '2020-01-15',
          active: true,
        },
        {
          id: 1002,
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob.smith@company.com',
          department: 'Engineering',
          title: 'Tech Lead',
          salary: 175000,
          hireDate: '2019-03-20',
          active: true,
        },
        {
          id: 1003,
          firstName: 'Charlie',
          lastName: 'Wang',
          email: 'charlie.wang@company.com',
          department: 'Engineering',
          title: 'Staff Engineer',
          salary: 185000,
          hireDate: '2018-06-10',
          active: true,
        },
        {
          id: 1004,
          firstName: 'Diana',
          lastName: 'Patel',
          email: 'diana.patel@company.com',
          department: 'Engineering',
          title: 'Principal Engineer',
          salary: 210000,
          hireDate: '2017-09-05',
          active: true,
        },
        {
          id: 1005,
          firstName: 'Eve',
          lastName: 'Johnson',
          email: 'eve.johnson@company.com',
          department: 'Engineering',
          title: 'Engineering Manager',
          salary: 195000,
          hireDate: '2019-11-12',
          active: false,
        },
      ],
    },
    jsonTokens: 893,
    minoteTokens: 348,
    reduction: 61,
  },
  {
    id: 'config-file',
    title: 'Application Configuration',
    description: 'Typical config file with database, API, and feature settings',
    category: 'Configuration',
    data: {
      app: {
        name: 'MyApp',
        version: '2.1.0',
        environment: 'production',
        debug: false,
      },
      database: {
        host: 'db.example.com',
        port: 5432,
        name: 'myapp_prod',
        pool: {
          min: 2,
          max: 10,
          idle: 10000,
        },
      },
      api: {
        baseUrl: 'https://api.example.com',
        timeout: 30000,
        retries: 3,
        rateLimit: 100,
      },
      features: {
        enableCache: true,
        enableMetrics: true,
        enableTracing: false,
        maxUploadSize: 10485760,
      },
    },
    jsonTokens: 267,
    minoteTokens: 142,
    reduction: 47,
  },
  {
    id: 'ml-training',
    title: 'ML Training Dataset',
    description: 'Machine learning training samples - extreme savings with table format (60%+)',
    category: 'Machine Learning',
    data: {
      dataset: 'customer_churn',
      features: ['tenure', 'monthlyCharges', 'totalCharges', 'numServices', 'contractType'],
      target: 'churn',
      samples: [
        {
          tenure: 24,
          monthlyCharges: 89.99,
          totalCharges: 2159.76,
          numServices: 4,
          contractType: 'monthly',
          churn: 1,
        },
        {
          tenure: 48,
          monthlyCharges: 65.5,
          totalCharges: 3144.0,
          numServices: 2,
          contractType: 'yearly',
          churn: 0,
        },
        {
          tenure: 12,
          monthlyCharges: 120.0,
          totalCharges: 1440.0,
          numServices: 6,
          contractType: 'monthly',
          churn: 1,
        },
        {
          tenure: 36,
          monthlyCharges: 75.25,
          totalCharges: 2709.0,
          numServices: 3,
          contractType: '2year',
          churn: 0,
        },
        {
          tenure: 6,
          monthlyCharges: 95.0,
          totalCharges: 570.0,
          numServices: 5,
          contractType: 'monthly',
          churn: 1,
        },
        {
          tenure: 60,
          monthlyCharges: 55.0,
          totalCharges: 3300.0,
          numServices: 1,
          contractType: '2year',
          churn: 0,
        },
      ],
      metadata: {
        totalSamples: 6,
        positiveClass: 3,
        negativeClass: 3,
        splitDate: '2025-01-01',
      },
    },
    jsonTokens: 678,
    minoteTokens: 271,
    reduction: 60,
  },
  {
    id: 'analytics-logs',
    title: 'Analytics Event Logs',
    description: 'User activity tracking events with timestamps and metadata',
    category: 'Analytics',
    data: {
      sessionId: 'sess_abc123',
      userId: 'user_456',
      events: [
        {
          event: 'page_view',
          timestamp: 1700000000,
          page: '/home',
          duration: 5000,
          device: 'desktop',
        },
        {
          event: 'click',
          timestamp: 1700000005,
          page: '/home',
          duration: 0,
          device: 'desktop',
        },
        {
          event: 'page_view',
          timestamp: 1700000010,
          page: '/products',
          duration: 8000,
          device: 'desktop',
        },
        {
          event: 'add_to_cart',
          timestamp: 1700000018,
          page: '/products',
          duration: 0,
          device: 'desktop',
        },
        {
          event: 'page_view',
          timestamp: 1700000020,
          page: '/checkout',
          duration: 12000,
          device: 'desktop',
        },
      ],
      summary: {
        totalEvents: 5,
        totalDuration: 25000,
        conversionEvent: 'purchase',
        converted: false,
      },
    },
    jsonTokens: 412,
    minoteTokens: 201,
    reduction: 51,
  },
]

export const defaultExample = examples[0]

export function getExampleById(id: string): Example | undefined {
  return examples.find((ex) => ex.id === id)
}
