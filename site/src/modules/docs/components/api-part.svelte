<!--
  One part's API: its heading (an anchor the anatomy links to), summary, props
  table and what else it takes, all from componentDocs().
-->
<script lang="ts" module>
  import type { PartDoc } from '#modules/docs/data/api-types.js'

  export type ApiPartProps = { part: PartDoc; heading: boolean }
</script>

<script lang="ts">
  import {
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Text,
  } from '@jovertical/mise-design-system'
  import { apiAnchor } from '#modules/docs/utils/anchors.js'

  let { part, heading }: ApiPartProps = $props()
</script>

<section
  data-api-part={part.name}
  id={apiAnchor(part.name)}
  class="flex scroll-mt-20 flex-col gap-3"
>
  {#if heading}
    <h3 class="text-base font-semibold"><code>{part.name}</code></h3>
  {/if}
  {#if part.summary}
    <Text as="p" muted>{part.summary}</Text>
  {/if}
  {#if !part.documented}
    <Text as="p" size="sm" muted>Takes no props of its own.</Text>
  {:else if part.props.length > 0}
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prop</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Default</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each part.props as prop (prop.name)}
          <TableRow>
            <TableCell class="align-top whitespace-nowrap">
              <code>{prop.name}</code>
              {#if !prop.optional}
                <Badge variant="outline" class="ml-1">required</Badge>
              {/if}
            </TableCell>
            <TableCell class="text-muted-foreground align-top whitespace-normal">
              <code>{prop.type}</code>
            </TableCell>
            <TableCell class="align-top">
              {#if prop.default !== null}
                <code>{prop.default}</code>
              {/if}
            </TableCell>
            <TableCell class="align-top whitespace-normal">{prop.description}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  {/if}
  {#if part.alsoTakes.length > 0}
    <Text as="p" size="sm" muted>Also takes: {part.alsoTakes.join('; ')}.</Text>
  {/if}
</section>
