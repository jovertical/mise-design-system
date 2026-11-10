/**
 * Reads what an agent needs from a Props type: the members declared on it,
 * their JSDoc, what else it takes, and the defaults. Pure; the TypeScript
 * compiler parses, nothing type-checks.
 */
import ts from 'typescript'

import { describe, oneLine, operands, scopeOf } from './type-phrases.js'

export type PropDoc = {
  name: string
  type: string
  optional: boolean
  default: string | null
  description: string
}

export type PropsDoc = { summary: string; props: PropDoc[]; alsoTakes: string[] }

const parse = (source: string) =>
  ts.createSourceFile('x.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

/** The first paragraph of the JSDoc directly above a node, on one line. */
function firstParagraph(node: ts.Node): string {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc)
  const text = ts.getTextOfJSDocComment(docs.at(-1)?.comment) ?? ''

  return oneLine(text.split(/\n\s*\n/)[0] ?? '')
}

/**
 * `interface XProps extends A, B { … }` rewritten as `type XProps = A & B & { … }`
 * in place, JSDoc and all, so one reader serves both declarations.
 */
function interfaceAsAlias(moduleScript: string, typeName: string): string {
  const source = parse(moduleScript)

  const declaration = source.statements.find(
    (statement): statement is ts.InterfaceDeclaration =>
      ts.isInterfaceDeclaration(statement) && statement.name.text === typeName,
  )

  if (!declaration) return moduleScript

  const bases = (declaration.heritageClauses ?? []).flatMap((clause) =>
    clause.types.map((type) => type.getText()),
  )

  const body = moduleScript.slice(declaration.members.pos, declaration.members.end)

  const exported = declaration.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  )

  const alias = `${exported ? 'export ' : ''}type ${typeName} = ${[...bases, `{${body}}`].join(' & ')}`

  return (
    moduleScript.slice(0, declaration.getStart(source)) +
    alias +
    moduleScript.slice(declaration.end)
  )
}

export function propsDoc(moduleScript: string, typeName: string): PropsDoc | null {
  const source = parse(interfaceAsAlias(moduleScript, typeName))

  const alias = source.statements.find(
    (statement): statement is ts.TypeAliasDeclaration =>
      ts.isTypeAliasDeclaration(statement) && statement.name.text === typeName,
  )

  if (!alias) return null

  const scope = scopeOf(source, typeName)
  const merged = new Set<string>()
  const props: PropDoc[] = []
  const alsoTakes: string[] = []

  for (const operand of operands(alias.type, scope)) {
    if (ts.isTypeLiteralNode(operand)) {
      addMembers(operand, props, merged)

      continue
    }

    const phrase = describe(operand, scope)

    if (!alsoTakes.includes(phrase)) alsoTakes.push(phrase)
  }

  for (const prop of props) {
    if (!merged.has(prop.name) && /^\(.*=>.*\)$/.test(prop.type)) prop.type = prop.type.slice(1, -1)
  }

  return { summary: firstParagraph(alias), props, alsoTakes }
}

/** A type literal's members as rows; a prop on both sides of a union becomes one row. */
function addMembers(literal: ts.TypeLiteralNode, props: PropDoc[], merged: Set<string>) {
  for (const member of literal.members) {
    if (!ts.isPropertySignature(member) || !member.type) continue

    const name = member.name.getText()

    // A function type joined into a union needs its own parentheses.
    const type = ts.isFunctionTypeNode(member.type)
      ? `(${oneLine(member.type.getText())})`
      : oneLine(member.type.getText())

    const seen = props.find((prop) => prop.name === name)

    if (!seen) {
      props.push({
        name,
        type,
        optional: member.questionToken !== undefined,
        default: null,
        description: firstParagraph(member),
      })

      continue
    }

    // The same prop on both sides of a union: one row, either type.
    if (!seen.type.split(' | ').includes(type)) {
      seen.type = `${seen.type} | ${type}`

      merged.add(name)
    }
  }
}

/**
 * The defaults in `let { a = 1, b, ref = $bindable(null), ...rest } = $props()`.
 * A key mapped to `null` is a binding with no default; `...rest` is left out.
 */
export function propDefaults(instanceScript: string): Map<string, string | null> {
  const defaults = new Map<string, string | null>()

  const visit = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isObjectBindingPattern(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText() === '$props'
    ) {
      for (const element of node.name.elements) {
        if (element.dotDotDotToken) continue

        const key = (element.propertyName ?? element.name).getText()

        defaults.set(key, element.initializer ? defaultText(element.initializer) : null)
      }

      return
    }

    ts.forEachChild(node, visit)
  }

  visit(parse(instanceScript))

  return defaults
}

/** `$bindable(x)` is a default of `x`; `$bindable()` is none. */
function defaultText(initializer: ts.Expression): string | null {
  if (ts.isCallExpression(initializer) && initializer.expression.getText() === '$bindable') {
    const [value] = initializer.arguments

    return value ? oneLine(value.getText()) : null
  }

  return oneLine(initializer.getText())
}
