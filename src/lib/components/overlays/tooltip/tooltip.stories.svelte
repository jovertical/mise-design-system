<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Hint from '../hint/hint.svelte'
  import Tooltip from './tooltip.svelte'
  import TooltipContent from './tooltip-content.svelte'
  import TooltipTrigger from './tooltip-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/Tooltip',
    component: Tooltip,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })
</script>

<!--
  A label for a control that cannot carry one: an icon button, a truncated cell,
  a disabled action that owes an explanation.

  Keep it to a phrase. A tooltip is dismissed by moving the mouse, so anything a
  reader has to work through will be gone before they finish.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Tooltip {...args}>
      <TooltipTrigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Hover me</Button>
        {/snippet}
      </TooltipTrigger>
      <TooltipContent>Regenerate the pairing code</TooltipContent>
    </Tooltip>
  {/snippet}
</Story>

<!--
  Every side, so the arrow can be checked against the panel it hangs off. The
  arrow is a rotated square pulled back under the panel's edge; it carries the
  surface colour and no ring of its own.
-->
<Story name="Sides" asChild>
  <div class="grid grid-cols-2 gap-6">
    {#each ['top', 'right', 'bottom', 'left'] as const as side}
      <Tooltip>
        <TooltipTrigger>
          {#snippet child({ props })}
            <Button variant="outline" class="capitalize" {...props}>{side}</Button>
          {/snippet}
        </TooltipTrigger>
        <TooltipContent {side}>Anchored {side}</TooltipContent>
      </Tooltip>
    {/each}
  </div>
</Story>

<!--
  A short label beside a long explanation, so both can be checked in light and
  dark. A tooltip is a phrase; a `Hint` carries the paragraph a caption cannot
  fit, capped at `max-w-xs` and balanced.
-->
<Story name="With a hint" asChild>
  <div class="flex items-center gap-4">
    <Tooltip>
      <TooltipTrigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Short label</Button>
        {/snippet}
      </TooltipTrigger>
      <TooltipContent>Suspend device</TooltipContent>
    </Tooltip>

    <span class="text-foreground flex items-center gap-1.5 text-sm font-medium">
      Sync backlog
      <Hint label="How sync figures are measured">
        Sync figures come from the sync-health report, which lists the 100 devices with the largest
        backlog and excludes any device whose client does not report sync metrics at all. An absent
        device shows "No signal", not zero: the report cannot tell a healthy device from a silent
        one.
      </Hint>
    </span>
  </div>
</Story>
