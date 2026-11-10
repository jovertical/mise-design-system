<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Avatar from './avatar.svelte'
  import AvatarFallback from './avatar-fallback.svelte'
  import AvatarImage from './avatar-image.svelte'
  import AvatarStatus from './avatar-status.svelte'
  import PresenceDot from './presence-dot.svelte'

  const SIZES = ['size-6', 'size-8', 'size-10', 'size-12'] as const

  /** The initials a caller sets at each size; `AvatarFallback` does not scale them. */
  const INITIALS: Record<(typeof SIZES)[number], string> = {
    'size-6': 'text-[0.625rem]',
    'size-8': '',
    'size-10': '',
    'size-12': 'text-lg',
  }

  const { Story } = defineMeta({
    title: 'Data display/Avatar',
    component: Avatar,
    tags: ['shadcn'],
  })
</script>

<!-- `AvatarFallback` renders while the image loads, and stays if it fails. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard>
      <div class="flex items-center gap-3">
        <Avatar {...args}>
          <AvatarImage src="https://github.com/shadcn.png" alt="Ana Cruz" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <Avatar {...args}>
          <AvatarImage src="/broken.png" alt="Ben Ortiz" />
          <AvatarFallback>BO</AvatarFallback>
        </Avatar>
      </div>
    </OnACard>
  {/snippet}
</Story>

<!--
  `size-8` by default. A caller resizing it has to set the initials inside too:
  `AvatarFallback` centres whatever it is given rather than scaling it.
-->
<Story name="Sizes" asChild>
  <OnACard>
    <StoryAxis values={SIZES}>
      {#snippet item(size)}
        <Avatar class={size}><AvatarFallback class={INITIALS[size]}>AC</AvatarFallback></Avatar>
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  `AvatarStatus` wraps an avatar with a pinging dot while someone is here, such
  as who has an order open. Offline, it is the avatar alone.
-->
<Story name="With status" asChild>
  <OnACard>
    <div class="flex items-center gap-3">
      <AvatarStatus isOnline label="Has this order open">
        <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>
      </AvatarStatus>
      <AvatarStatus isOnline={false}>
        <Avatar><AvatarFallback>BO</AvatarFallback></Avatar>
      </AvatarStatus>
    </div>
  </OnACard>
</Story>

<!-- `PresenceDot` on its own, for an edge that is not an avatar's. -->
<Story name="Presence" asChild>
  <OnACard>
    <PresenceDot label="Here now" />
  </OnACard>
</Story>
