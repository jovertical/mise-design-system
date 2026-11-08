<script module lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Collapsible from './collapsible.svelte'
  import CollapsibleContent from './collapsible-content.svelte'
  import CollapsibleTrigger from './collapsible-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Layout/Collapsible',
    component: Collapsible,
    tags: ['shadcn'],
    args: { open: true },
  })
</script>

<!--
  Unstyled: the primitive holds open state and nothing else. `AsideCard` builds
  a real card on top of it; reach for `Collapsible` directly when the surface
  around it is not a card.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Collapsible {...args} class="w-80">
      <CollapsibleTrigger>
        {#snippet child({ props })}
          <Button variant="outline" class="w-full justify-between" {...props}>
            Show details
            <ChevronDownIcon class="size-4" />
          </Button>
        {/snippet}
      </CollapsibleTrigger>
      <CollapsibleContent class="text-muted-foreground mt-2 text-sm">
        North depot holds 398 units across 22 items, last counted 16 Jul 2026.
      </CollapsibleContent>
    </Collapsible>
  {/snippet}
</Story>
