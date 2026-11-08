<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Avatar from '../../data-display/avatar/avatar.svelte'
  import AvatarFallback from '../../data-display/avatar/avatar-fallback.svelte'
  import HoverCard from './hover-card.svelte'
  import HoverCardContent from './hover-card-content.svelte'
  import HoverCardTrigger from './hover-card-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/HoverCard',
    component: HoverCard,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })
</script>

<!--
  A preview on hover or focus, for a fact worth a glance without leaving the
  page: a person's details behind their name, a linked record's summary. Reach
  for `Tooltip` instead when the content is a single short label.
-->
<Story name="Playground">
  {#snippet template(args)}
    <HoverCard {...args}>
      <HoverCardTrigger href="#person" class="text-sm font-medium underline underline-offset-4">
        Dana Reyes
      </HoverCardTrigger>
      <HoverCardContent class="flex items-start gap-3">
        <Avatar><AvatarFallback>DR</AvatarFallback></Avatar>
        <div class="flex min-w-0 flex-col">
          <span class="text-sm font-medium">Dana Reyes</span>
          <span class="text-muted-foreground text-xs">Shift lead, North depot</span>
          <span class="text-muted-foreground mt-1 text-xs">Joined 12 Mar 2025</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  {/snippet}
</Story>
