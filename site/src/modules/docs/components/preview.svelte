<!--
  An example live on a stage, and its own source on the Code tab.
-->
<script lang="ts" module>
  import type { Example } from '#modules/docs/data/example.js'

  export type PreviewProps = { example: Example; class?: string }
</script>

<script lang="ts">
  import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@jovertical/mise-design-system'

  import CodeBlock from './code-block.svelte'

  let { example, class: className }: PreviewProps = $props()

  const shown = $derived.by(() => {
    if (!example) throw new Error("Preview: no such example in this page's examples/ folder")

    return example
  })

  let tab = $state('preview')
</script>

<Card class={['not-prose my-6 gap-0 overflow-hidden py-0', className]}>
  <Tabs bind:value={tab} class="gap-0">
    <div class="border-b px-3 py-2">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="preview">
      <div class="flex min-h-40 flex-wrap items-center justify-center gap-3 p-8">
        <shown.component />
      </div>
    </TabsContent>
    <TabsContent value="code">
      <CodeBlock
        html={shown.html}
        source={shown.source}
        class="[&_pre]:max-h-96 [&_pre]:rounded-none"
      />
    </TabsContent>
  </Tabs>
</Card>
