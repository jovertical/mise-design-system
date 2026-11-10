<!--
  A component's API (every part) or one part's, from mise's Props types. A
  name mise does not have throws, failing the prerender.
-->
<script lang="ts" module>
  export type ApiTableProps = { component?: string; part?: string }
</script>

<script lang="ts">
  import { Text } from '@jovertical/mise-design-system'
  import { folderNamed, partNamed } from '#modules/docs/data/api.js'

  import ApiPart from './api-part.svelte'

  let { component, part }: ApiTableProps = $props()

  const folder = $derived(component ? folderNamed(component) : null)

  const parts = $derived.by(() => {
    if (part) return [partNamed(part).part]

    if (!folder) throw new Error('ApiTable: give component or part')

    return folder.parts
  })

  const types = $derived(folder?.types ?? [])
</script>

<div class="my-6 flex flex-col gap-8">
  {#each parts as entry (entry.name)}
    <ApiPart part={entry} heading={parts.length > 1 || Boolean(part)} />
  {/each}
  {#if types.length > 0}
    <Text as="p" size="sm" muted>
      Types:
      {#each types as type, index (type.name)}
        <code>{type.name}</code>
        {#if type.literals}
          &nbsp;(<code>{type.literals}</code>)
        {/if}
        {index < types.length - 1 ? ', ' : ''}
      {/each}
    </Text>
  {/if}
</div>
