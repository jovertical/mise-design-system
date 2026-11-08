#!/usr/bin/env node
import { runThemeCli } from '../dist/tokens/cli.js'

const { code, message } = await runThemeCli(process.argv.slice(2))

if (code === 0) console.log(message)
else console.error(message)

process.exit(code)
