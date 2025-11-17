import { describe, it, expect } from 'vitest'
import { JsonToMinoteConverter, MinoteToJsonConverter } from '../../src/converter'

describe('JsonToMinoteConverter', () => {
  const converter = new JsonToMinoteConverter()

  it('should convert simple object', () => {
    const json = {
      name: 'Alice',
      age: 30,
      active: true,
    }

    const minote = converter.convert(json)
    expect(minote).toContain('name: Alice')
    expect(minote).toContain('age: 30')
    expect(minote).toContain('active: true')
  })

  it('should convert nested objects', () => {
    const json = {
      user: {
        name: 'Alice',
        contact: {
          email: 'alice@example.com',
        },
      },
    }

    const minote = converter.convert(json)
    expect(minote).toContain('user')
    expect(minote).toContain('name: Alice')
    expect(minote).toContain('contact')
    // Email with @ must be quoted, so check for the email content (with or without quotes)
    expect(minote).toContain('alice@example.com')
  })

  it('should convert arrays to tables when appropriate', () => {
    const json = {
      users: [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        { id: 3, name: 'Charlie', age: 35 },
      ],
    }

    const minote = converter.convert(json)
    expect(minote).toContain('#Row[')
    expect(minote).toMatch(/\|.*\|.*\|/)
  })

  it('should keep small arrays inline', () => {
    const json = {
      tags: ['a', 'b', 'c'],
    }

    const minote = converter.convert(json)
    expect(minote).toContain('[')
    expect(minote).toContain(']')
  })

  it('should handle empty objects and arrays', () => {
    const json = {
      empty_obj: {},
      empty_arr: [],
    }

    const minote = converter.convert(json)
    expect(minote).toBeDefined()
  })
})

describe('MinoteToJsonConverter', () => {
  const converter = new MinoteToJsonConverter()

  it('should convert simple MINOTE to JSON', () => {
    const minote = `
name: Alice
age: 30
active: true
    `.trim()

    const json = converter.convertToObject(minote)
    expect(json).toEqual({
      name: 'Alice',
      age: 30,
      active: true,
    })
  })

  it('should convert nested objects', () => {
    const minote = `
user
  name: Alice
  contact
    email: "alice@example.com"
    `.trim()

    const json = converter.convertToObject(minote) as any
    expect(json.user.name).toBe('Alice')
    expect(json.user.contact.email).toBe('alice@example.com')
  })

  it('should convert tables to arrays', () => {
    const minote = `
users
  #User[id@i name@s age@i]
  |1|Alice|30|
  |2|Bob|25|
    `.trim()

    const json = converter.convertToObject(minote) as any
    expect(Array.isArray(json.users)).toBe(true)
    expect(json.users).toHaveLength(2)
    expect(json.users[0]).toEqual({ id: 1, name: 'Alice', age: 30 })
    expect(json.users[1]).toEqual({ id: 2, name: 'Bob', age: 25 })
  })

  it('should convert inline arrays', () => {
    const minote = 'tags: [developer designer team-lead]'

    const json = converter.convertToObject(minote) as any
    expect(json.tags).toEqual(['developer', 'designer', 'team-lead'])
  })
})
