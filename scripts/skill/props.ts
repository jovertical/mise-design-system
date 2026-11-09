/**
 * Reads what an agent needs from a Props type: the members declared on it,
 * their JSDoc, what else it takes, and the defaults. Pure; the TypeScript
 * compiler parses, nothing type-checks.
 */
import ts from 'typescript'

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

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()

/** The first paragraph of the JSDoc directly above a node, on one line. */
function firstParagraph(node: ts.Node): string {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc)
  const text = ts.getTextOfJSDocComment(docs.at(-1)?.comment) ?? ''
  return oneLine(text.split(/\n\s*\n/)[0] ?? '')
}

const TAGS: Record<string, string> = {
  Anchor: 'a',
  Li: 'li',
  Input: 'input',
  Button: 'button',
  Textarea: 'textarea',
  Table: 'table',
  Td: 'td',
  Th: 'th',
  Img: 'img',
  Label: 'label',
  Ol: 'ol',
  Form: 'form',
}

const ELEMENTS: Record<string, string> = {
  Div: 'div',
  Span: 'span',
  Paragraph: 'p',
  Heading: 'h1>`–`<h6',
  UList: 'ul',
  OList: 'ol',
  LI: 'li',
  TableRow: 'tr',
  TableSection: 'thead',
  TableCell: 'td',
  Table: 'table',
  Anchor: 'a',
  Button: 'button',
  Input: 'input',
  Element: 'element',
  Nav: 'nav',
}

/** bits-ui's helpers that strip the snippet props a mise part renders itself. */
const WITHOUT: Record<string, string> = {
  WithoutChildrenOrChild: '`children`, `child`',
  WithoutChildren: '`children`',
  WithoutChild: '`child`',
}

/** What a module script's own names stand for: its local aliases and its imports. */
type Scope = {
  locals: Map<string, ts.TypeNode>
  imports: Map<string, { module: string; name: string }>
}

function scopeOf(source: ts.SourceFile, except: string): Scope {
  const locals = new Map<string, ts.TypeNode>()
  const imports = new Map<string, { module: string; name: string }>()
  for (const statement of source.statements) {
    if (ts.isTypeAliasDeclaration(statement) && statement.name.text !== except) {
      locals.set(statement.name.text, statement.type)
    }
    const bindings = ts.isImportDeclaration(statement)
      ? statement.importClause?.namedBindings
      : undefined
    if (!bindings || !ts.isNamedImports(bindings)) continue
    const module = (statement as ts.ImportDeclaration).moduleSpecifier.getText().slice(1, -1)
    for (const element of bindings.elements) {
      imports.set(element.name.text, {
        module,
        name: (element.propertyName ?? element.name).text,
      })
    }
  }
  return { locals, imports }
}

/** One operand of a Props intersection, in a phrase an agent can act on. */
function describe(node: ts.TypeNode, scope: Scope, depth = 0): string {
  const text = oneLine(node.getText())
  const again = (inner: ts.TypeNode) => describe(inner, scope, depth + 1)

  if (ts.isParenthesizedTypeNode(node)) return again(node.type)
  if (ts.isTypeReferenceNode(node)) {
    const name = node.typeName.getText()
    const args = node.typeArguments ?? []
    if ((name === 'WithElementRef' || name === 'Extract') && args[0]) return again(args[0])
    const without = WITHOUT[name]
    if (without && args[0]) return `${again(args[0])} except ${without}`
    if (name === 'Pick' && args[0] && args[1]) {
      const keys = [...args[1].getText().matchAll(/'([^']+)'/g)].map((match) => `\`${match[1]}\``)
      const from = args[0].getText().replace(/Props$/, '')
      return `${keys.join(', ')} from \`${from}\``
    }
    if (name === 'Omit' && args[0] && args[1]) {
      const keys = [...args[1].getText().matchAll(/'([^']+)'/g)].map((match) => `\`${match[1]}\``)
      return `${again(args[0])} except ${keys.join(', ')}`
    }
    if (name === 'HTMLAttributes') {
      const element = args[0]?.getText().match(/^HTML(\w*)Element$/)?.[1] ?? 'Element'
      return `every \`<${ELEMENTS[element] ?? element.toLowerCase()}>\` attribute`
    }
    const tag = name.match(/^HTML(\w+)Attributes$/)?.[1]
    if (tag) return `every \`<${TAGS[tag] ?? tag.toLowerCase()}>\` attribute`
    const primitive = name.match(/^(\w+)Primitive\.(\w+)Props$/)
    if (primitive) return `bits-ui \`${primitive[1]}.${primitive[2]}\` props`
    const local = scope.locals.get(name)
    if (local && depth < 5) return again(local)
    const imported = scope.imports.get(name)
    if (imported && !imported.module.startsWith('.')) {
      return `\`${imported.module}\` \`${imported.name}\``
    }
    const part = name.match(/^(\w+)Props$/)
    if (part) return `everything \`${part[1]}\` takes`
  }
  return `\`${text}\``
}

/**
 * The operands of a type, flattened through `&`, `|`, parentheses and the
 * module's own aliases of object types, so a member declared on a local
 * `type Single = { … }` becomes a row like any other.
 */
function operands(node: ts.TypeNode, scope: Scope, depth = 0): ts.TypeNode[] {
  const again = (inner: ts.TypeNode) => operands(inner, scope, depth + 1)
  if (ts.isParenthesizedTypeNode(node)) return again(node.type)
  if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
    return node.types.flatMap(again)
  }
  // `ref` is on every part (SKILL.md says so), so the wrapper adds nothing to read.
  if (ts.isTypeReferenceNode(node) && node.typeName.getText() === 'WithElementRef') {
    const [inner] = node.typeArguments ?? []
    if (inner) return again(inner)
  }
  if (ts.isTypeReferenceNode(node) && !node.typeArguments && depth < 5) {
    const local = scope.locals.get(node.typeName.getText())
    if (local && isObjectShaped(local)) return again(local)
  }
  return [node]
}

/** A type literal, or `&` / `|` of type literals: something that declares members. */
function isObjectShaped(node: ts.TypeNode): boolean {
  if (ts.isParenthesizedTypeNode(node)) return isObjectShaped(node.type)
  if (ts.isTypeLiteralNode(node)) return true
  if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
    return node.types.some(isObjectShaped)
  }
  return false
}

export function propsDoc(moduleScript: string, typeName: string): PropsDoc | null {
  const source = parse(moduleScript)
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
    if (!ts.isTypeLiteralNode(operand)) {
      const phrase = describe(operand, scope)
      if (!alsoTakes.includes(phrase)) alsoTakes.push(phrase)
      continue
    }
    for (const member of operand.members) {
      if (!ts.isPropertySignature(member) || !member.type) continue
      const name = member.name.getText()
      // A function type joined into a union needs its own parentheses.
      const type = ts.isFunctionTypeNode(member.type)
        ? `(${oneLine(member.type.getText())})`
        : oneLine(member.type.getText())
      const seen = props.find((prop) => prop.name === name)
      if (seen) {
        // The same prop on both sides of a union: one row, either type.
        if (!seen.type.split(' | ').includes(type)) {
          seen.type = `${seen.type} | ${type}`
          merged.add(name)
        }
        continue
      }
      props.push({
        name,
        type,
        optional: member.questionToken !== undefined,
        default: null,
        description: firstParagraph(member),
      })
    }
  }

  for (const prop of props) {
    if (!merged.has(prop.name) && /^\(.*=>.*\)$/.test(prop.type)) prop.type = prop.type.slice(1, -1)
  }

  return { summary: firstParagraph(alias), props, alsoTakes }
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
