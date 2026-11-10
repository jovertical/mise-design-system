/**
 * The values behind a type name a Props table shows: `BadgeVariant` is
 * `'solid' | 'soft' | 'outline'`. An agent cannot act on a name, so the
 * catalogue prints the values wherever they can be read from source without
 * a type checker: a union of literals, a cva variant's keys, or an alias of
 * either. Anything else keeps its name.
 */
import ts from 'typescript'

const parse = (source: string) =>
  ts.createSourceFile('x.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

const isLiteral = (node: ts.TypeNode) =>
  ts.isLiteralTypeNode(node) &&
  (ts.isStringLiteral(node.literal) || ts.isNumericLiteral(node.literal))

/** `cva(base, { variants: { key: { a: …, b: … } } })`, as key to `'a' | 'b'`. */
function cvaVariants(source: ts.SourceFile): Map<string, Map<string, string>> {
  const found = new Map<string, Map<string, string>>()

  const visit = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText() === 'cva'
    ) {
      const options = node.initializer.arguments[1]

      const variants =
        options && ts.isObjectLiteralExpression(options)
          ? options.properties.find(
              (property): property is ts.PropertyAssignment =>
                ts.isPropertyAssignment(property) && property.name.getText() === 'variants',
            )?.initializer
          : undefined

      if (variants && ts.isObjectLiteralExpression(variants)) {
        const keys = new Map<string, string>()

        for (const variant of variants.properties) {
          if (
            !ts.isPropertyAssignment(variant) ||
            !ts.isObjectLiteralExpression(variant.initializer)
          ) {
            continue
          }

          const values = variant.initializer.properties.map(
            (value) => `'${value.name?.getText().replace(/^['"]|['"]$/g, '')}'`,
          )

          keys.set(variant.name.getText().replace(/^['"]|['"]$/g, ''), values.join(' | '))
        }

        found.set(node.name.text, keys)
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)

  return found
}

/** `NonNullable<VariantProps<typeof v>['key']>`, as `[v, key]`. */
function variantLookup(node: ts.TypeNode): [string, string] | null {
  const text = node.getText().replace(/\s+/g, '')
  const match = text.match(/^NonNullable<VariantProps<typeof(\w+)>\['([\w-]+)'\]>$/)

  return match ? [match[1], match[2]] : null
}

/**
 * Every exported type alias in `sources` that resolves to a set of literals,
 * by name. Names are unique across the package (the barrel would fail
 * otherwise), so one flat map serves every component.
 */
export function literalAliases(sources: string[]): Map<string, string> {
  const raw = new Map<string, ts.TypeNode>()
  const variants = new Map<string, Map<string, string>>()

  for (const text of sources) {
    const source = parse(text)

    for (const [name, keys] of cvaVariants(source)) variants.set(name, keys)

    for (const statement of source.statements) {
      if (ts.isTypeAliasDeclaration(statement) && !statement.typeParameters) {
        raw.set(statement.name.text, statement.type)
      }
    }
  }

  const resolved = new Map<string, string>()

  const resolve = (name: string, seen: Set<string>): string | null => {
    if (resolved.has(name)) return resolved.get(name) ?? null

    const node = raw.get(name)

    if (!node || seen.has(name)) return null

    seen.add(name)

    let value: string | null = null

    if (ts.isUnionTypeNode(node) && node.types.every(isLiteral)) {
      value = node.types.map((type) => type.getText()).join(' | ')
    } else if (isLiteral(node)) {
      value = node.getText()
    } else if (ts.isTypeReferenceNode(node) && !node.typeArguments) {
      value = resolve(node.typeName.getText(), seen)
    } else {
      const lookup = variantLookup(node)

      if (lookup) value = variants.get(lookup[0])?.get(lookup[1]) ?? null
    }

    if (value) resolved.set(name, value)

    return value
  }

  for (const name of raw.keys()) resolve(name, new Set())

  return resolved
}
