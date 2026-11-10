/**
 * How a Props type reads to an agent: each operand of an intersection as a
 * phrase ("every `<div>` attribute", "bits-ui `Select.Root` props"), and the
 * operands flattened through the module's own aliases. Split from props.ts.
 */
import ts from 'typescript'

export const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()

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
  // One element type for all three sections, so the phrase names all three.
  TableSection: 'thead>`, `<tbody>` or `<tfoot',
  DList: 'dl',
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
export type Scope = {
  locals: Map<string, ts.TypeNode>
  imports: Map<string, { module: string; name: string }>
}

export function scopeOf(source: ts.SourceFile, except: string): Scope {
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
export function describe(node: ts.TypeNode, scope: Scope, depth = 0): string {
  if (ts.isParenthesizedTypeNode(node)) return describe(node.type, scope, depth + 1)

  const phrase = ts.isTypeReferenceNode(node) ? describeReference(node, scope, depth) : null

  return phrase ?? `\`${oneLine(node.getText())}\``
}

/** `'a' | 'b'` as `` `a`, `b` ``. */
const quotedKeys = (keys: ts.TypeNode) =>
  [...keys.getText().matchAll(/'([^']+)'/g)].map((match) => `\`${match[1]}\``).join(', ')

/** A named type: a wrapper to see through, a utility, an HTML attribute set, or a part's props. */
function describeReference(node: ts.TypeReferenceNode, scope: Scope, depth: number) {
  const name = node.typeName.getText()
  const [first, second] = node.typeArguments ?? []
  const again = (inner: ts.TypeNode) => describe(inner, scope, depth + 1)

  if ((name === 'WithElementRef' || name === 'Extract') && first) return again(first)

  if (WITHOUT[name] && first) return `${again(first)} except ${WITHOUT[name]}`

  if (name === 'Pick' && first && second) {
    return `${quotedKeys(second)} from \`${first.getText().replace(/Props$/, '')}\``
  }

  if (name === 'Omit' && first && second) return `${again(first)} except ${quotedKeys(second)}`

  return attributesPhrase(name, first) ?? scopedPhrase(name, scope, depth, again)
}

/** `HTMLAttributes<HTMLDivElement>` or `HTMLButtonAttributes` as the element's attributes. */
function attributesPhrase(name: string, element: ts.TypeNode | undefined): string | null {
  if (name === 'HTMLAttributes') {
    const tag = element?.getText().match(/^HTML(\w*)Element$/)?.[1] ?? ''

    if (!tag) return 'every HTML attribute'

    return `every \`<${ELEMENTS[tag] ?? tag.toLowerCase()}>\` attribute`
  }

  const tag = name.match(/^HTML(\w+)Attributes$/)?.[1]

  return tag ? `every \`<${TAGS[tag] ?? tag.toLowerCase()}>\` attribute` : null
}

/** A bits-ui primitive's props, a local alias, an import from a package, or a part's props. */
function scopedPhrase(
  name: string,
  scope: Scope,
  depth: number,
  again: (inner: ts.TypeNode) => string,
): string | null {
  const primitive = name.match(/^(\w+)Primitive\.(\w+)Props$/)

  if (primitive) return `bits-ui \`${primitive[1]}.${primitive[2]}\` props`

  const local = scope.locals.get(name)

  if (local && depth < 5) return again(local)

  const imported = scope.imports.get(name)

  if (imported && !imported.module.startsWith('.')) {
    return `\`${imported.module}\` \`${imported.name}\``
  }

  const part = name.match(/^(\w+)Props$/)

  return part ? `everything \`${part[1]}\` takes` : null
}

/**
 * The operands of a type, flattened through `&`, `|`, parentheses and the
 * module's own aliases of object types, so a member declared on a local
 * `type Single = { … }` becomes a row like any other.
 */
export function operands(node: ts.TypeNode, scope: Scope, depth = 0): ts.TypeNode[] {
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
