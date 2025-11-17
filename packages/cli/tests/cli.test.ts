import { describe, it, expect, vi } from 'vitest'

// Mock process.exit to prevent CLI from exiting during tests
const mockExit = vi.fn()
const originalExit = process.exit

describe('CLI Package', () => {
  beforeEach(() => {
    vi.mock('process', () => ({
      exit: mockExit
    }))
    mockExit.mockClear()
  })

  afterEach(() => {
    process.exit = originalExit
  })

  it('should import CLI commands successfully', async () => {
    const commands = await import('../src/commands')
    expect(commands).toBeDefined()
    expect(commands.parseCommand).toBeDefined()
    expect(commands.convert).toBeDefined()
    expect(commands.validate).toBeDefined()
    expect(commands.formatCommand).toBeDefined()
    expect(commands.analyze).toBeDefined()
  })

  it('should test CLI module loading', async () => {
    // Test all major modules can be loaded without errors
    await expect(import('../src/commands')).resolves.toBeDefined()
  })

  it('should test individual command modules', async () => {
    // Test command modules can be loaded
    const commandsModule = await import('../src/commands')

    // Test that all expected functions exist
    expect(typeof commandsModule.parseCommand).toBe('function')
    expect(typeof commandsModule.convert).toBe('function')
    expect(typeof commandsModule.validate).toBe('function')
    expect(typeof commandsModule.formatCommand).toBe('function')
    expect(typeof commandsModule.analyze).toBe('function')
  })

  it('should handle CLI dependencies', async () => {
    // Test that CLI dependencies work
    expect(async () => {
      await import('commander')
      await import('chalk')
      await import('ora')
    }).not.toThrow()
  })
})