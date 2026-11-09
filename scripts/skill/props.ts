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

/** One operand of a Props intersection, in a phrase an agent can act on. */
function describe(node: ts.TypeNode): string {
  const text = oneLine(node.getText())

  if (ts.isParenthesizedTypeNode(node)) return describe(node.type)
  if (ts.isTypeReferenceNode(node)) {
    const name = node.typeName.getText()
    const args = node.typeArguments ?? []
    if (name === 'WithElementRef' && args[0]) return describe(args[0])
    if (name === 'Omit' && args[0] && args[1]) {
      const keys = [...args[1].getText().matchAll(/'([^']+)'/g)].map((match) => `\`${match[1]}\``)
      return `${describe(args[0])} except ${keys.join(', ')}`
    }
    if (name === 'HTMLAttributes') {
      const element = args[0]?.getText().match(/^HTML(\w*)Element$/)?.[1] ?? 'Element'
      return `every \`<${ELEMENTS[element] ?? element.toLowerCase()}>\` attribute`
    }
    const tag = name.match(/^HTML(\w+)Attributes$/)?.[1]
    if (tag) return `every \`<${TAGS[tag] ?? tag.toLowerCase()}>\` attribute`
    const primitive = name.match(/^(\w+)Primitive\.(\w+)Props$/)
    if (primitive) return `bits-ui \`${primitive[1]}.${primitive[2]}\` props`
    const part = name.match(/^(\w+)Props$/)
    if (part) return `everything \`${part[1]}\` takes`
  }
  return `\`${text}\``
}

/** The non-literal operands of a type, flattened through `&` and `|`. */
function operands(node: ts.TypeNode): ts.TypeNode[] {
  if (ts.isParenthesizedTypeNode(node)) return operands(node.type)
  if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
    return node.types.flatMap(operands)
  }
  return [node]
}

export function propsDoc(moduleScript: string, typeName: string): PropsDoc | null {
  const source = parse(moduleScript)
  const alias = source.statements.find(
    (statement): statement is ts.TypeAliasDeclaration =>
      ts.isTypeAliasDeclaration(statement) && statement.name.text === typeName,
  )
  if (!alias) return null

  const props: PropDoc[] = []
  const alsoTakes: string[] = []
  for (const operand of operands(alias.type)) {
    if (!ts.isTypeLiteralNode(operand)) {
      const phrase = describe(operand)
      if (!alsoTakes.includes(phrase)) alsoTakes.push(phrase)
      continue
    }
    for (const member of operand.members) {
      if (!ts.isPropertySignature(member) || !member.type) continue
      const name = member.name.getText()
      if (props.some((prop) => prop.name === name)) continue
      props.push({
        name,
        type: oneLine(member.type.getText()),
        optional: member.questionToken !== undefined,
        default: null,
        description: firstParagraph(member),
      })
    }
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
