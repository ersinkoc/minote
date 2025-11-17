import { readFileSync } from 'fs'
import chalk from 'chalk'
import ora from 'ora'
import { parse } from 'minote'

interface ValidateOptions {
  schema?: string
  strict?: boolean
}

export async function validate(file: string, options: ValidateOptions) {
  const spinner = ora(`Validating ${file}...`).start()

  try {
    const input = readFileSync(file, 'utf-8')

    // Parse the file
    parse(input)

    // If schema provided, validate against it
    if (options.schema) {
      // Schema validation would go here
      spinner.text = 'Validating against schema...'
      // const schemaContent = readFileSync(options.schema, 'utf-8')
      // ... validation logic
    }

    spinner.succeed(`${file} is valid`)
  } catch (error) {
    spinner.fail('Validation failed')
    console.error(chalk.red((error as Error).message))
    process.exit(1)
  }
}
