import { readFileSync, writeFileSync } from 'fs'
import chalk from 'chalk'
import ora from 'ora'
import { format } from 'minote'

interface FormatOptions {
  output?: string
  indent?: string
  check?: boolean
}

export async function formatCommand(file: string, options: FormatOptions) {
  const spinner = ora(`Formatting ${file}...`).start()

  try {
    const input = readFileSync(file, 'utf-8')
    const formatted = format(input, {
      indent: options.indent ? parseInt(options.indent, 10) : 2,
    })

    if (options.check) {
      if (input === formatted) {
        spinner.succeed(`${file} is already formatted`)
        process.exit(0)
      } else {
        spinner.fail(`${file} is not formatted`)
        process.exit(1)
      }
    }

    const outputPath = options.output || file

    writeFileSync(outputPath, formatted, 'utf-8')
    spinner.succeed(`Formatted ${outputPath}`)
  } catch (error) {
    spinner.fail('Format failed')
    console.error(chalk.red((error as Error).message))
    process.exit(1)
  }
}
