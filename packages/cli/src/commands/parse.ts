import { readFileSync, writeFileSync } from 'fs'
import chalk from 'chalk'
import ora from 'ora'
import { parse } from 'minote'

interface ParseOptions {
  output?: string
  json?: boolean
  pretty?: boolean
}

export async function parseCommand(file: string, options: ParseOptions) {
  const spinner = ora(`Parsing ${file}...`).start()

  try {
    const input = readFileSync(file, 'utf-8')
    const ast = parse(input)

    let output: string

    if (options.json) {
      output = options.pretty
        ? JSON.stringify(ast, null, 2)
        : JSON.stringify(ast)
    } else {
      output = JSON.stringify(ast, null, 2)
    }

    if (options.output) {
      writeFileSync(options.output, output, 'utf-8')
      spinner.succeed(`Parsed to ${options.output}`)
    } else {
      spinner.stop()
      console.log(output)
    }
  } catch (error) {
    spinner.fail('Parse failed')
    console.error(chalk.red((error as Error).message))
    process.exit(1)
  }
}
