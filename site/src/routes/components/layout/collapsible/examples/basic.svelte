<!--
  Unstyled: the primitive holds open state and nothing else. The trigger
  takes a Button through its `child` snippet.
-->
<script lang="ts">
  import {
    Button,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from '@jovertical/mise-design-system'
  import IconChevronDown from '@tabler/icons-svelte-runes/icons/chevron-down'

  let open = $state(false)
</script>

<Collapsible bind:open class="w-80">
  <CollapsibleTrigger>
    {#snippet child({ props })}
      <Button variant="outline" class="w-full justify-between" {...props}>
        {open ? 'Hide details' : 'Show details'}
        <IconChevronDown class="size-4 transition-transform {open ? 'rotate-180' : ''}" />
      </Button>
    {/snippet}
  </CollapsibleTrigger>
  <CollapsibleContent class="text-muted-foreground mt-2 text-sm">
    North depot holds 398 units across 22 items, last counted 16 Jul 2026.
  </CollapsibleContent>
</Collapsible>
