<!--
  Source highlighted at build (vite/highlight.ts), with a copy button. The
  html is trusted: it is Shiki's output for files in this repository.
-->
<script lang="ts" module>
  export type CodeBlockProps = { html: string; source: string; class?: string }
</script>

<script lang="ts">
  import { Button, cn, toast } from '@jovertical/mise-design-system'
  import IconCopy from '@tabler/icons-svelte-runes/icons/copy'

  let { html, source, class: className }: CodeBlockProps = $props()

  async function copy() {
    await navigator.clipboard.writeText(source)

    toast.success('Copied')
  }
</script>

<div class={cn('relative', className)}>
  {@html html}
  <Button
    variant="ghost"
    size="sm"
    iconOnly
    aria-label="Copy code"
    class="absolute top-2 right-2"
    onclick={copy}
  >
    <IconCopy />
  </Button>
</div>
