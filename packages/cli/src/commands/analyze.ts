import { readFileSync } from 'fs'
import { extname } from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { JsonToMinoteConverter, estimateTokens, calculateReduction } from 'minote'

interface AnalyzeOptions {
  format?: 'auto' | 'minote' | 'json'
  tokenizer?: 'gpt4' | 'claude'
}

export async function analyze(file: string, options: AnalyzeOptions) {
  const spinner = ora(`Analyzing ${file}...`).start()

  try {
    const input = readFileSync(file, 'utf-8')
    const ext = extname(file)

    // Detect format
    let format = options.format || 'auto'
    if (format === 'auto') {
      format = ext === '.minote' ? 'minote' : 'json'
    }

    spinner.text = 'Calculating token usage...'

    let minoteTokens: number
    let jsonTokens: number

    if (format === 'json') {
      // Convert to MINOTE and compare
      const converter = new JsonToMinoteConverter()
      const minote = converter.convert(input)

      jsonTokens = estimateTokens(input)
      minoteTokens = estimateTokens(minote)
    } else {
      // Convert to JSON and compare
      const { MinoteToJsonConverter } = await import('minote')
      const converter = new MinoteToJsonConverter({ pretty: true })
      const json = converter.convert(input)

      minoteTokens = estimateTokens(input)
      jsonTokens = estimateTokens(json)
    }

    spinner.succeed('Analysis complete')

    // Display results
    console.log('\n' + chalk.bold('Token Usage Analysis'))
    console.log(chalk.dim('─'.repeat(50)))

    console.log(chalk.cyan('JSON:    ') + jsonTokens + ' tokens')
    console.log(chalk.green('MINOTE:  ') + minoteTokens + ' tokens')

    const reduction = calculateReduction(jsonTokens, minoteTokens)
    const color = reduction > 0 ? chalk.green : chalk.red

    console.log(
      color(
        `Reduction: ${reduction > 0 ? '-' : '+'}${Math.abs(reduction).toFixed(1)}%`
      )
    )

    console.log(chalk.dim('\nNote: Token estimates are approximate (4 chars/token)'))
  } catch (error) {
    spinner.fail('Analysis failed')
    console.error(chalk.red((error as Error).message))
    process.exit(1)
  }
}
