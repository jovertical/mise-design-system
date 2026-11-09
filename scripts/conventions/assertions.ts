/** No `!` non-null assertion outside tests: narrow with a guard instead. */
import ts from 'typescript'

import type { Violation } from './index.js'
import type { ParsedFile } from './parse.js'

export function nonNullViolations(file: ParsedFile): Violation[] {
  if (isTest(file.path)) return []

  return file.scripts.flatMap(({ source, lineOffset }) => {
    const found: Violation[] = []

    const visit = (node: ts.Node) => {
      if (ts.isNonNullExpression(node)) {
        const line =
          source.getLineAndCharacterOfPosition(node.getStart(source)).line + lineOffset + 1

        found.push({ path: file.path, line, rule: 'non-null', detail: `"${node.getText(source)}"` })
      }

      ts.forEachChild(node, visit)
    }

    visit(source)

    return found
  })
}

const isTest = (path: string) => path.startsWith('tests/') || path.includes('/tests/')
