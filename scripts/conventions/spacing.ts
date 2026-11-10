/**
 * The spacing rule: statements breathe. Decides, for each pair of neighbouring
 * statements, whether a blank line is required between them, and reports the
 * edits that would satisfy it, which `pnpm fix:spacing` applies.
 */
import ts from 'typescript'

import type { Violation } from './index.js'
import type { ParsedFile, ScriptUnit } from './parse.js'

/** An edit to the file's text: insert or delete at an absolute offset. */
export type SpacingEdit = { offset: number; insert: string; deleteCount: number }

type Finding = { line: number; detail: string; edit: SpacingEdit }

const ADD = 'add a blank line before this statement'
const REMOVE_ABOVE = 'remove the blank line above this statement'
const REMOVE_BELOW = 'remove the blank line below this statement'

export function spacingViolations(file: ParsedFile): Violation[] {
  return findings(file).map(({ line, detail }) => ({
    path: file.path,
    line,
    rule: 'spacing',
    detail,
  }))
}

export function spacingEdits(file: ParsedFile): SpacingEdit[] {
  return findings(file).map(({ edit }) => edit)
}

function findings(file: ParsedFile): Finding[] {
  return file.scripts.flatMap((unit) => {
    const found: Finding[] = []

    const visit = (node: ts.Node) => {
      const statements = statementList(node)

      if (statements) found.push(...checkList(unit, node, statements))

      ts.forEachChild(node, visit)
    }

    visit(unit.source)

    return found
  })
}

function statementList(node: ts.Node): readonly ts.Statement[] | null {
  if (ts.isSourceFile(node) || ts.isBlock(node) || ts.isModuleBlock(node)) return node.statements

  if (ts.isCaseClause(node) || ts.isDefaultClause(node)) return node.statements

  return null
}

function checkList(unit: ScriptUnit, owner: ts.Node, statements: readonly ts.Statement[]) {
  const { source } = unit
  const found: Finding[] = []

  for (const [index, next] of statements.entries()) {
    if (index === 0) continue

    const previous = statements[index - 1]

    if (mayGroup(previous, next, source)) continue

    if (blankLinesBetween(source, endLine(previous, source), startLine(next, source)).length > 0) {
      continue
    }

    found.push({
      line: startLine(next, source) + unit.lineOffset + 1,
      detail: ADD,
      edit: insertAfter(unit, previous),
    })
  }

  if (ts.isBlock(owner) && statements.length > 0) found.push(...blockEdges(unit, owner, statements))

  return found
}

/** Rule 5: nothing blank between a block's braces and its first or last statement. */
function blockEdges(unit: ScriptUnit, block: ts.Block, statements: readonly ts.Statement[]) {
  const { source } = unit
  const first = statements[0]
  const last = statements[statements.length - 1]
  const openLine = lineOf(block.getStart(source), source)
  const closeLine = lineOf(block.getEnd() - 1, source)
  const found: Finding[] = []

  for (const blank of blankLinesBetween(source, openLine, startLine(first, source))) {
    found.push({
      line: startLine(first, source) + unit.lineOffset + 1,
      detail: REMOVE_ABOVE,
      edit: deleteLine(unit, blank),
    })
  }

  for (const blank of blankLinesBetween(source, endLine(last, source), closeLine)) {
    found.push({
      line: startLine(last, source) + unit.lineOffset + 1,
      detail: REMOVE_BELOW,
      edit: deleteLine(unit, blank),
    })
  }

  return found
}

/** Whether the pair may sit on adjacent lines (rule 2); otherwise a blank line is required. */
function mayGroup(previous: ts.Node, next: ts.Node, source: ts.SourceFile) {
  // Imports and re-exports are one group however they wrap, as Biome sorts them.
  if (isImportOrExport(previous) && isImportOrExport(next)) return true

  if (isMultiLine(previous, source) || isMultiLine(next, source)) return false

  if (isGuard(previous, source)) return false

  if (isDeclaration(previous) && isDeclaration(next)) return true

  if (isAssignment(previous) && isAssignment(next)) return true

  return isAssertion(previous) && isAssertion(next)
}

/** `expect(…)…`, awaited or not: a test's assertions read as one step. */
function isAssertion(node: ts.Node) {
  if (!ts.isExpressionStatement(node)) return false

  let expression: ts.Expression = node.expression

  if (ts.isAwaitExpression(expression)) expression = expression.expression

  while (ts.isCallExpression(expression) || ts.isPropertyAccessExpression(expression)) {
    const inner = expression.expression

    if (ts.isIdentifier(inner) && inner.text === 'expect') return true

    expression = inner
  }

  return false
}

const isImportOrExport = (node: ts.Node) =>
  ts.isImportDeclaration(node) || ts.isExportDeclaration(node) || ts.isImportEqualsDeclaration(node)

const isDeclaration = (node: ts.Node) =>
  ts.isVariableStatement(node) || ts.isTypeAliasDeclaration(node)

function isAssignment(node: ts.Node) {
  if (!ts.isExpressionStatement(node) || !ts.isBinaryExpression(node.expression)) return false

  const operator = node.expression.operatorToken.kind

  return operator >= ts.SyntaxKind.FirstAssignment && operator <= ts.SyntaxKind.LastAssignment
}

function isGuard(node: ts.Node, source: ts.SourceFile) {
  if (!ts.isIfStatement(node) || node.elseStatement || isMultiLine(node, source)) return false

  const then = node.thenStatement

  return (
    ts.isReturnStatement(then) ||
    ts.isThrowStatement(then) ||
    ts.isContinueStatement(then) ||
    ts.isBreakStatement(then)
  )
}

const lineOf = (position: number, source: ts.SourceFile) =>
  source.getLineAndCharacterOfPosition(position).line

/** A statement's first line, counting the comment above it as part of it. */
function startLine(node: ts.Node, source: ts.SourceFile) {
  const comments = ts.getLeadingCommentRanges(source.text, node.getFullStart()) ?? []

  return lineOf(comments[0]?.pos ?? node.getStart(source), source)
}

const endLine = (node: ts.Node, source: ts.SourceFile) => lineOf(node.getEnd(), source)

const isMultiLine = (node: ts.Node, source: ts.SourceFile) =>
  lineOf(node.getStart(source), source) !== endLine(node, source)

/** The blank lines strictly between two lines, as 0-based line numbers. */
function blankLinesBetween(source: ts.SourceFile, after: number, before: number) {
  const lines = source.getLineStarts()
  const blanks: number[] = []

  for (let line = after + 1; line < before; line++) {
    const end = line + 1 < lines.length ? lines[line + 1] : source.text.length

    if (source.text.slice(lines[line], end).trim() === '') blanks.push(line)
  }

  return blanks
}

/** A newline inserted at the end of the statement's last line. */
function insertAfter(unit: ScriptUnit, previous: ts.Node): SpacingEdit {
  const newline = unit.source.text.indexOf('\n', previous.getEnd())
  const position = newline === -1 ? unit.source.text.length : newline

  return { offset: unit.offset + position, insert: '\n', deleteCount: 0 }
}

/** The whole of one blank line, its newline included. */
function deleteLine(unit: ScriptUnit, line: number): SpacingEdit {
  const lines = unit.source.getLineStarts()
  const start = lines[line]
  const end = line + 1 < lines.length ? lines[line + 1] : unit.source.text.length

  return { offset: unit.offset + start, insert: '', deleteCount: end - start }
}
