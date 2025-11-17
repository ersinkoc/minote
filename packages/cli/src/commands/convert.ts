import { readFileSync, writeFileSync } from 'fs'
import { extname } from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { JsonToMinoteConverter, MinoteToJsonConverter, estimateTokens, calculateReduction } from 'minote'

interface ConvertOptions {
  to: 'minote' | 'json'
  output?: string
  types: boolean
  tables: boolean
  minTableRows: string
}

export async function convert(file: string, options: ConvertOptions) {
  const spinner = ora(`Converting ${file}...`).start()

  try {
    // Read input
    const input = readFileSync(file, 'utf-8')
    const ext = extname(file)

    // Detect source format
    const sourceFormat = ext === '.minote' ? 'minote' : 'json'
    const targetFormat = options.to

    // Validate conversion
    if (sourceFormat === targetFormat) {
      spinner.fail('Source and target formats are the same')
      process.exit(1)
    }

    // Convert
    let output: string

    if (sourceFormat === 'json' && targetFormat === 'minote') {
      const converter = new JsonToMinoteConverter({
        useTypes: options.types,
        useTables: options.tables,
        minTableRows: parseInt(options.minTableRows, 10),
      })
      output = converter.convert(input)
    } else if (sourceFormat === 'minote' && targetFormat === 'json') {
      const converter = new MinoteToJsonConverter({ pretty: true })
      output = converter.convert(input)
    } else {
      spinner.fail('Invalid conversion')
      console.log(chalk.red(`Cannot convert ${sourceFormat} to ${targetFormat}`))
      process.exit(1)
    }

    // Write output
    if (options.output) {
      writeFileSync(options.output, output, 'utf-8')
      spinner.succeed(`Converted to ${options.output}`)
    } else {
      spinner.stop()
      console.log(output)
    }

    // Stats
    const inputTokens = estimateTokens(input)
    const outputTokens = estimateTokens(output)
    const reduction = calculateReduction(inputTokens, outputTokens)

    console.log(
      chalk.dim(
        `\nTokens: ${inputTokens} → ${outputTokens} (${reduction >= 0 ? '-' : '+'}${Math.abs(reduction).toFixed(1)}%)`
      )
    )
  } catch (error) {
    spinner.fail('Conversion failed')
    console.error(chalk.red((error as Error).message))
    process.exit(1)
  }
}
