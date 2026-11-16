<!--
  `truncateTitle` for a title someone else wrote, like a ticket's subject:
  one line, the badge kept beside it, the whole subject as a tooltip.
-->
<script lang="ts">
  import { Badge, PageHeader } from '@jovertical/mise-design-system'
</script>

{#snippet open()}
  <Badge variant="outline">Open</Badge>
{/snippet}

<div class="w-full max-w-2xl">
  <PageHeader
    title="The register at the North location stops sending orders after a few hours and we cannot see them"
    titleAccessory={open}
    truncateTitle
  />
</div>
