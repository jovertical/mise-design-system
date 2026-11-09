/**
 * A file read once into what the rules need: its TypeScript (the whole file,
 * or each `<script>` of a Svelte file, placed at its offset) and the names a
 * Svelte template declares.
 */
import { parse as parseSvelte } from 'svelte/compiler'
import ts from 'typescript'

/** A TypeScript source to check, and where it sits in the file. */
export type ScriptUnit = {
  source: ts.SourceFile
  /** The 0-based file line of the source's first line. */
  lineOffset: number
  /** The file offset of the source's first character. */
  offset: number
}

/** A name declared in a Svelte template: an {#each} item or index, a snippet parameter. */
export type NameSite = { name: string; line: number }

export type ParsedFile = {
  path: string
  lineCount: number
  scripts: ScriptUnit[]
  templateNames: NameSite[]
}

export function parseFile(path: string, text: string): ParsedFile {
  const lineCount = text.endsWith('\n') ? text.split('\n').length - 1 : text.split('\n').length

  if (!path.endsWith('.svelte')) {
    return { path, lineCount, scripts: [script(path, text, 0, 0)], templateNames: [] }
  }

  const lineOf = lineIndex(text)
  const ast = parseSvelte(text, { modern: true })

  const scripts = [ast.module, ast.instance]
    .filter((block) => block !== null && block !== undefined)
    .map((block) => {
      const start = text.indexOf('>', block.start) + 1
      const end = text.lastIndexOf('</script>', block.end)

      return script(path, text.slice(start, end), start, lineOf(start) - 1)
    })

  return { path, lineCount, scripts, templateNames: templateNames(ast.fragment, lineOf) }
}

function script(path: string, text: string, offset: number, lineOffset: number): ScriptUnit {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

  return { source, lineOffset, offset }
}

/** A function from a file offset to its 1-based line. */
function lineIndex(text: string) {
  const starts = [0]

  for (const [index, character] of [...text].entries()) {
    if (character === '\n') starts.push(index + 1)
  }

  return (offset: number) => {
    let low = 0
    let high = starts.length - 1

    while (low < high) {
      const middle = Math.ceil((low + high) / 2)

      if (starts[middle] <= offset) low = middle
      else high = middle - 1
    }

    return low + 1
  }
}

type AnyNode = { type?: string; start?: number; [key: string]: unknown }

/** Every name the template declares, from the AST svelte/compiler builds. */
function templateNames(fragment: unknown, lineOf: (offset: number) => number): NameSite[] {
  const sites: NameSite[] = []

  const declare = (pattern: unknown, at: number) => {
    for (const name of patternNames(pattern)) sites.push({ name, line: lineOf(at) })
  }

  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item)

      return
    }

    if (!value || typeof value !== 'object') return

    const node = value as AnyNode
    const at = node.start ?? 0

    switch (node.type) {
      case 'EachBlock':
        declare(node.context, at)
        if (typeof node.index === 'string') sites.push({ name: node.index, line: lineOf(at) })
        break
      case 'SnippetBlock':
        for (const parameter of (node.parameters as unknown[]) ?? []) declare(parameter, at)
        break
      case 'ConstTag':
        for (const declarator of ((node.declaration as AnyNode)?.declarations as AnyNode[]) ?? [])
          declare(declarator.id, at)
        break
      case 'AwaitBlock':
        declare(node.value, at)
        declare(node.error, at)
        break
      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
        for (const parameter of (node.params as unknown[]) ?? []) declare(parameter, at)
        break
    }

    for (const [key, child] of Object.entries(node)) {
      if (key !== 'parent' && key !== 'metadata') visit(child)
    }
  }

  visit(fragment)

  return sites
}

/** The identifiers an ESTree binding pattern declares. */
function patternNames(pattern: unknown): string[] {
  if (!pattern || typeof pattern !== 'object') return []

  const node = pattern as AnyNode

  switch (node.type) {
    case 'Identifier':
      return [node.name as string]
    case 'ObjectPattern':
      return (node.properties as AnyNode[]).flatMap((property) =>
        patternNames(property.type === 'RestElement' ? property.argument : property.value),
      )
    case 'ArrayPattern':
      return (node.elements as unknown[]).flatMap((element) => patternNames(element))
    case 'AssignmentPattern':
      return patternNames(node.left)
    case 'RestElement':
      return patternNames(node.argument)
    default:
      return []
  }
}
