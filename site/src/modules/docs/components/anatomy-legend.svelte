<!--
  The anatomy's key: each part's number, label, export (linked to its API
  table) and data-slot. Hovering or focusing a row outlines the part.
-->
<script lang="ts" module>
  import type { AnatomyPart } from '#modules/docs/utils/anatomy-parts.js'

  export type AnatomyLegendProps = {
    parts: AnatomyPart[]
    missing: string[]
    active: number | null
  }
</script>

<script lang="ts">
  import { Badge } from '@jovertical/mise-design-system'
  import { partKey } from '#modules/docs/utils/anatomy-parts.js'
  import { apiAnchor } from '#modules/docs/utils/anchors.js'

  let { parts, missing, active = $bindable(null) }: AnatomyLegendProps = $props()
</script>

<div class="border-t">
  <ol class="grid gap-1 p-4 text-sm sm:grid-cols-2">
    {#each parts as part, index (partKey(part))}
      <li
        class={[
          'flex items-center gap-2 rounded-md px-2 py-1.5',
          active === index && 'bg-foreground/[0.07]',
        ]}
        onmouseenter={() => (active = index)}
        onmouseleave={() => (active = null)}
      >
        <button
          type="button"
          class="flex items-center gap-2 text-left"
          onfocus={() => (active = index)}
          onblur={() => (active = null)}
        >
          <span
            class="bg-primary text-primary-foreground grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
          >
            {index + 1}
          </span>
          <span>{part.label}</span>
        </button>
        {#if part.part}
          <a href="#{apiAnchor(part.part)}" class="text-primary"><code>{part.part}</code></a>
        {/if}
        {#if missing.includes(partKey(part))}
          <Badge tone="critical" variant="soft">not found</Badge>
        {/if}
        <code class="text-muted-foreground ml-auto text-xs">{partKey(part)}</code>
      </li>
    {/each}
  </ol>
</div>
