/**
 * Two remark plugins for the pages. `baseLinks` puts the Pages base path on a
 * Markdown link to a page (`/getting-started/theming`), which mdsvex would
 * otherwise leave pointing at the domain's root. `headingIds` gives h2 and h3
 * the id the "On this page" rail links to. `slugOf` is pure, so the browser
 * imports it too.
 */
type MarkdownNode = {
  type: string
  url?: string
  depth?: number
  value?: string
  data?: { hProperties?: Record<string, string> }
  children?: MarkdownNode[]
}

export function slugOf(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function baseLinks(base: string) {
  return () => (tree: MarkdownNode) => visit(tree, (node) => prefixLink(node, base))
}

export function headingIds() {
  return () => (tree: MarkdownNode) => visit(tree, giveId)
}

function prefixLink(node: MarkdownNode, base: string) {
  if (node.type !== 'link' || !node.url?.startsWith('/') || node.url.startsWith('//')) return

  node.url = `${base}${node.url}`
}

function giveId(node: MarkdownNode) {
  if (node.type !== 'heading' || (node.depth !== 2 && node.depth !== 3)) return

  node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: slugOf(textOf(node)) } }
}

function textOf(node: MarkdownNode): string {
  return node.value ?? (node.children ?? []).map(textOf).join('')
}

function visit(node: MarkdownNode, action: (node: MarkdownNode) => void) {
  action(node)

  for (const child of node.children ?? []) visit(child, action)
}
