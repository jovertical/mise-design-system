/**
 * The names rule: no single letter and no abbreviation wherever a name is
 * declared. Imports and type parameters are not checked; see the guide.
 */
import ts from 'typescript'

import type { Violation } from './index.js'
import type { ParsedFile } from './parse.js'

/** Single letters a reader knows on sight: chart coordinates. */
const ALLOWED_SINGLE = new Set(['x', 'y'])

const BANNED = new Set([
  'acc',
  'arr',
  'btn',
  'cb',
  'cfg',
  'ctx',
  'curr',
  'el',
  'err',
  'ev',
  'evt',
  'fn',
  'idx',
  'msg',
  'num',
  'obj',
  'opts',
  'pkg',
  'prev',
  'res',
  'str',
  'tmp',
  'val',
])

export function nameViolations(file: ParsedFile): Violation[] {
  const scriptNames = file.scripts.flatMap(({ source, lineOffset }) =>
    declaredNames(source).map(({ name, node }) => ({
      name,
      line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + lineOffset + 1,
    })),
  )

  return [...scriptNames, ...file.templateNames]
    .filter(({ name }) => isBanned(name))
    .map(({ name, line }) => ({
      path: file.path,
      line,
      rule: 'names' as const,
      detail: `"${name}" is too short or abbreviated`,
    }))
}

/** Whether a declared name breaks the rule. */
export function isBanned(name: string) {
  if (name.startsWith('_')) return false

  if (name.length === 1) return !ALLOWED_SINGLE.has(name)

  return BANNED.has(name)
}

function declaredNames(source: ts.SourceFile) {
  const found: { name: string; node: ts.Node }[] = []

  const bind = (name: ts.BindingName) => {
    if (ts.isIdentifier(name)) {
      found.push({ name: name.text, node: name })

      return
    }

    for (const element of name.elements) {
      if (ts.isBindingElement(element)) bind(element.name)
    }
  }

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) return

    if (ts.isVariableDeclaration(node) || ts.isParameter(node)) bind(node.name)

    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && node.name) {
      found.push({ name: node.name.text, node: node.name })
    }

    ts.forEachChild(node, visit)
  }

  visit(source)

  return found
}
