/** The size rules: a file's length by kind, and a function's length. */
import ts from 'typescript'

import type { Violation } from './index.js'
import type { ParsedFile } from './parse.js'

const FILE_LIMIT = { svelte: 250, ts: 300 }
const FUNCTION_LIMIT = 40

export function fileLengthViolations(file: ParsedFile): Violation[] {
  const limit = file.path.endsWith('.svelte') ? FILE_LIMIT.svelte : FILE_LIMIT.ts

  if (file.lineCount <= limit) return []

  const detail = `${file.lineCount} lines, over ${limit}`

  return [{ path: file.path, line: 1, rule: 'file-length', detail }]
}

export function functionLengthViolations(file: ParsedFile): Violation[] {
  return file.scripts.flatMap(({ source, lineOffset }) => {
    const found: Violation[] = []

    const visit = (node: ts.Node) => {
      if (isFunctionWithBody(node)) {
        const first = source.getLineAndCharacterOfPosition(node.getStart(source)).line
        const last = source.getLineAndCharacterOfPosition(node.getEnd()).line
        const length = last - first + 1

        if (length > FUNCTION_LIMIT) {
          const detail = `${length} lines, over ${FUNCTION_LIMIT}`

          found.push({
            path: file.path,
            line: first + lineOffset + 1,
            rule: 'function-length',
            detail,
          })
        }
      }

      ts.forEachChild(node, visit)
    }

    visit(source)

    return found
  })
}

/**
 * A suite's body is a grouping, not logic, so a `describe` callback is not
 * measured; each `it` inside it still is.
 */
function isSuiteBody(node: ts.Node) {
  const call = node.parent

  if (!call || !ts.isCallExpression(call)) return false

  const callee = call.expression.getText()

  return callee === 'describe' || callee.startsWith('describe.')
}

function isFunctionWithBody(node: ts.Node) {
  const isFunction =
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isGetAccessor(node) ||
    ts.isSetAccessor(node)

  return isFunction && node.body !== undefined && !isSuiteBody(node)
}
