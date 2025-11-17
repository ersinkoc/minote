#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { parseCommand, convert, validate, formatCommand, analyze } from './commands'

const program = new Command()

program
  .name('minote')
  .description(chalk.bold('MINOTE') + ' - Minimal Notation for LLMs')
  .version('1.0.0')

// Parse command
program
  .command('parse <file>')
  .description('Parse MINOTE file and output AST')
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .option('-j, --json', 'Output as JSON', true)
  .option('-p, --pretty', 'Pretty print output', true)
  .action(parseCommand)

// Convert command
program
  .command('convert <file>')
  .description('Convert between MINOTE and JSON')
  .option('-t, --to <format>', 'Target format (minote|json)', 'json')
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .option('--no-types', 'Omit type annotations (MINOTE output)')
  .option('--no-tables', 'Disable table optimization (MINOTE output)')
  .option('--min-table-rows <n>', 'Min rows for table format', '3')
  .action(convert)

// Validate command
program
  .command('validate <file>')
  .description('Validate MINOTE file')
  .option('-s, --schema <file>', 'Schema file')
  .option('--strict', 'Strict mode (warnings as errors)')
  .action(validate)

// Format command
program
  .command('format <file>')
  .description('Format MINOTE file')
  .option('-o, --output <file>', 'Output file (default: overwrite)')
  .option('-i, --indent <n>', 'Indent size', '2')
  .option('--check', 'Check if formatted (exit 1 if not)')
  .action(formatCommand)

// Analyze command
program
  .command('analyze <file>')
  .description('Analyze token usage (MINOTE vs JSON)')
  .option('-f, --format <format>', 'Input format (auto|minote|json)', 'auto')
  .option('--tokenizer <name>', 'Tokenizer to use (gpt4|claude)', 'gpt4')
  .action(analyze)

// Error handling
program.showHelpAfterError('(add --help for additional information)')

program.parse()
