<script lang="ts">
  import {
    Button,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from '@jovertical/mise-design-system'
</script>

<Collapsible open class="w-80">
  <CollapsibleTrigger>
    {#snippet child({ props })}
      <Button variant="outline" class="w-full" {...props}>Hide details</Button>
    {/snippet}
  </CollapsibleTrigger>
  <CollapsibleContent class="text-muted-foreground mt-2 text-sm">
    North depot holds 398 units across 22 items.
  </CollapsibleContent>
</Collapsible>
