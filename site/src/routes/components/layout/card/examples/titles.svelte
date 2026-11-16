<!--
  A leading glyph marks where a section starts: bare and muted, or in a chip
  with `iconTone="primary"` for a long form whose headings are its structure.
  A heading that needs qualifying takes a Hint, not a figure in CardAction.
-->
<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle, Hint } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
</script>

{#snippet warehouse()}
  <IconBuildingWarehouse />
{/snippet}

<div class="grid w-full max-w-4xl gap-4 md:grid-cols-3">
  <Card>
    <CardHeader><CardTitle icon={warehouse}>Supplier</CardTitle></CardHeader>
    <CardContent class="text-muted-foreground text-sm">Who they are.</CardContent>
  </Card>
  <Card>
    <CardHeader><CardTitle icon={warehouse} iconTone="primary">Supplier</CardTitle></CardHeader>
    <CardContent class="text-muted-foreground text-sm">Who they are.</CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>
        Stock health
        <Hint label="How stock health is calculated">
          Available stock against the reorder point set on each category.
        </Hint>
      </CardTitle>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">Six categories reporting.</CardContent>
  </Card>
</div>
