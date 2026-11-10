/**
 * Shiki, once per build, with the css-variables theme: each token is coloured
 * by a `--shiki-*` variable that app.css maps onto mise's semantic tokens, so
 * code follows the theme and dark mode with no colours of its own.
 */
import { createCssVariablesTheme, createHighlighter, type Highlighter } from 'shiki'

const THEME = createCssVariablesTheme({ name: 'mise', variablePrefix: '--shiki-', fontStyle: true })
const LANGUAGES = ['svelte', 'ts', 'js', 'css', 'html', 'json', 'sh']

let highlighter: Promise<Highlighter> | null = null

export async function highlightCode(code: string, language: string): Promise<string> {
  highlighter ??= createHighlighter({ themes: [THEME], langs: LANGUAGES })

  const loaded = await highlighter

  return loaded.codeToHtml(code, {
    lang: LANGUAGES.includes(language) ? language : 'text',
    theme: 'mise',
  })
}
