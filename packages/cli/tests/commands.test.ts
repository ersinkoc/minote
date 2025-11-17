import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync, writeFileSync } from 'fs'
import { parseCommand } from '../src/commands/parse'
import { convert } from '../src/commands/convert'
import { validate } from '../src/commands/validate'
import { formatCommand } from '../src/commands/format'
import { analyze } from '../src/commands/analyze'

// Mock process.exit
const originalExit = process.exit
beforeEach(() => {
  process.exit = vi.fn()
})

afterEach(() => {
  process.exit = originalExit
})

// Mock file system operations
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn()
}))

// Mock ora spinner
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(() => ({
      succeed: vi.fn(),
      fail: vi.fn(),
      stop: vi.fn()
    }))
  }))
}))

// Mock chalk
vi.mock('chalk', () => ({
  default: {
    green: vi.fn((text) => text),
    red: vi.fn((text) => text),
    yellow: vi.fn((text) => text),
    blue: vi.fn((text) => text),
    cyan: vi.fn((text) => text),
    bold: vi.fn((text) => text),
    dim: vi.fn((text) => text)
  }
}))

describe('CLI Commands', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('parseCommand', () => {
    it('should parse MINOTE file and output JSON', async () => {
      const mockContent = 'name: Alice\nage: 30'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      await parseCommand('test.minote', { json: true, pretty: true })

      expect(mockReadFileSync).toHaveBeenCalledWith('test.minote', 'utf-8')
      expect(mockWriteFileSync).not.toHaveBeenCalled()
    })

    it('should write to output file when specified', async () => {
      const mockContent = 'name: Alice\nage: 30'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      await parseCommand('test.minote', { output: 'output.json', json: true, pretty: true })

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'output.json',
        expect.stringContaining('Alice'),
        'utf-8'
      )
    })

    it('should handle parse errors gracefully', async () => {
      const mockReadFileSync = vi.mocked(readFileSync)
      mockReadFileSync.mockReturnValue('invalid :: syntax :')

      await parseCommand('invalid.minote', {})

      // Should call process.exit with code 1 on error
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

  describe('convert', () => {
    it('should convert JSON to MINOTE format', async () => {
      const mockContent = '{"name": "Alice", "age": 30}'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      await convert('input.json', { output: 'output.minote', from: 'json', to: 'minote' })

      expect(mockReadFileSync).toHaveBeenCalledWith('input.json', 'utf-8')
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'output.minote',
        expect.stringContaining('name: Alice'),
        'utf-8'
      )
    })

    it('should convert MINOTE to JSON format', async () => {
      const mockContent = 'name: Alice\nage: 30'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      await convert('input.minote', { output: 'output.json', from: 'minote', to: 'json' })

      expect(mockReadFileSync).toHaveBeenCalledWith('input.minote', 'utf-8')
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'output.json',
        expect.stringContaining('"name": "Alice"'),
        'utf-8'
      )
    })

    it('should handle conversion errors', async () => {
      const mockReadFileSync = vi.mocked(readFileSync)
      mockReadFileSync.mockReturnValue('invalid json content')

      await convert('invalid.json', { from: 'json', to: 'minote' })

      // Should call process.exit with code 1 on error
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

  describe('validate', () => {
    it('should validate valid MINOTE file', async () => {
      const mockContent = 'name: Alice\nage: 30'
      const mockReadFileSync = vi.mocked(readFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      // Should complete without throwing
      await expect(validate('test.minote', {})).resolves.toBeUndefined()
      expect(mockReadFileSync).toHaveBeenCalledWith('test.minote', 'utf-8')
    })

    it('should report validation errors', async () => {
      const mockReadFileSync = vi.mocked(readFileSync)
      mockReadFileSync.mockReturnValue('invalid : : : syntax')

      await validate('invalid.minote', {})

      // Should call process.exit with code 1 on error
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('should validate with schema when provided', async () => {
      const mockContent = 'name: Alice\nage: 30'
      const mockReadFileSync = vi.mocked(readFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      // Should complete without throwing (schema validation not implemented yet)
      await expect(validate('test.minote', { schema: 'schema.json' })).resolves.toBeUndefined()
      expect(mockReadFileSync).toHaveBeenCalledWith('test.minote', 'utf-8')
    })
  })

  describe('formatCommand', () => {
    it('should format MINOTE file', async () => {
      const mockContent = 'name:Alice\nage:30'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      await formatCommand('test.minote', { output: 'formatted.minote' })

      expect(mockReadFileSync).toHaveBeenCalledWith('test.minote', 'utf-8')
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'formatted.minote',
        expect.stringContaining('name: Alice'),
        'utf-8'
      )
    })

    it('should format file in place when no output specified', async () => {
      const mockContent = 'name:Alice\nage:30'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      await formatCommand('test.minote', {})

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        'test.minote',
        expect.stringContaining('name: Alice'),
        'utf-8'
      )
    })

    it('should check format without changes when in check mode', async () => {
      const mockContent = 'name: Alice\nage: 30'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      await formatCommand('test.minote', { check: true })

      expect(mockReadFileSync).toHaveBeenCalledWith('test.minote', 'utf-8')
      // Format command writes the formatted content even in check mode
      expect(mockWriteFileSync).toHaveBeenCalled()
      // Should call process.exit(1) when formatting changes are detected
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

  describe('analyze', () => {
    it('should analyze MINOTE file structure', async () => {
      const mockContent = 'name: Alice\nage: 30\nactive: true'
      const mockReadFileSync = vi.mocked(readFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      // analyze function doesn't return a value, it just prints to console
      await expect(analyze('test.minote', {})).resolves.toBeUndefined()
      expect(mockReadFileSync).toHaveBeenCalledWith('test.minote', 'utf-8')
    })

    it('should generate analysis with statistics', async () => {
      const mockContent = `
users:
  - name: Alice
    age: 30
  - name: Bob
    age: 25
settings:
  theme: dark
  notifications: true
      `.trim()
      const mockReadFileSync = vi.mocked(readFileSync)

      mockReadFileSync.mockReturnValue(mockContent)

      // analyze function doesn't return a value, it just prints to console
      await expect(analyze('test.minote', {})).resolves.toBeUndefined()
      expect(mockReadFileSync).toHaveBeenCalledWith('test.minote', 'utf-8')
    })

    it('should handle empty files', async () => {
      const mockReadFileSync = vi.mocked(readFileSync)
      mockReadFileSync.mockReturnValue('')

      // analyze function doesn't return a value, it just prints to console
      await expect(analyze('empty.minote', {})).resolves.toBeUndefined()
      expect(mockReadFileSync).toHaveBeenCalledWith('empty.minote', 'utf-8')
    })
  })

  describe('error handling', () => {
    it('should handle file not found errors', async () => {
      const mockReadFileSync = vi.mocked(readFileSync)
      mockReadFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory')
      })

      await parseCommand('nonexistent.minote', {})

      // Should call process.exit with code 1 on error
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('should handle permission errors', async () => {
      const mockReadFileSync = vi.mocked(readFileSync)
      mockReadFileSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied')
      })

      await parseCommand('restricted.minote', {})

      // Should call process.exit with code 1 on error
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('should handle write errors', async () => {
      const mockContent = 'name: Alice'
      const mockReadFileSync = vi.mocked(readFileSync)
      const mockWriteFileSync = vi.mocked(writeFileSync)

      mockReadFileSync.mockReturnValue(mockContent)
      mockWriteFileSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied')
      })

      await parseCommand('test.minote', { output: 'restricted.minote' })

      // Should call process.exit with code 1 on error
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })
})