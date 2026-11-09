#!/usr/bin/env node
import { readFile } from 'node:fs/promises'

import { runThemeCli } from '../dist/tokens/cli.js'

const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const { code, message } = await runThemeCli(process.argv.slice(2), process.cwd(), version)

if (code === 0) console.log(message)
else console.error(message)

process.exit(code)
