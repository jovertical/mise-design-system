<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconCalendar from '@tabler/icons-svelte-runes/icons/calendar'
  import IconCircleCheck from '@tabler/icons-svelte-runes/icons/circle-check'
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'
  import IconSparkles from '@tabler/icons-svelte-runes/icons/sparkles'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'
  import type { Component } from 'svelte'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import StoryMatrix from '../../../../../stories/story-matrix.svelte'
  import { TONES, type Tone } from '../../../utils/tone.js'
  import IconChip from './icon-chip.svelte'

  const SIZES = ['sm', 'md', 'lg'] as const
  const SHAPES = ['square', 'circle'] as const

  const { Story } = defineMeta({
    title: 'Data display/IconChip',
    component: IconChip,
    tags: ['mise'],
    argTypes: {
      size: { control: 'inline-radio', options: SIZES },
      shape: { control: 'inline-radio', options: SHAPES },
      tone: { control: 'select', options: TONES },
    },
  })

  const TONE_ICON: Record<Tone, Component> = {
    neutral: IconPackage,
    primary: IconSparkles,
    info: IconInfoCircle,
    success: IconCircleCheck,
    warning: IconAlertTriangle,
    critical: IconAlertTriangle,
  }

  const facts = [
    { icon: IconBuildingWarehouse, label: 'Location', value: 'Riverside' },
    { icon: IconUser, label: 'Requested by', value: 'Ana Cruz' },
    { icon: IconCalendar, label: 'Date counted', value: '16 Jul 2026' },
  ]
</script>

<!-- Every prop, for poking at in the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard
      ><IconChip {...args}><IconPackage /></IconChip></OnACard
    >
  {/snippet}
</Story>

<!--
  Three sizes, two shapes. The square's radius steps with the size (`lg` at
  32px, `xl` at 40 and 48), so a chip inline with text takes the text's tighter
  corner and one in open space takes the tile's.
-->
<Story name="Matrix" asChild>
  <OnACard>
    <StoryMatrix rows={SHAPES} columns={SIZES}>
      {#snippet cell(shape, size)}
        <IconChip {size} {shape}><IconPackage /></IconChip>
      {/snippet}
    </StoryMatrix>
  </OnACard>
</Story>

<!--
  The soft wash of the shared `Tone`. Neutral is the default and should stay the
  common case. `primary` is the brand, for a heading that should read as ours,
  never a status.
-->
<Story name="Tones" asChild>
  <OnACard>
    <StoryAxis values={TONES}>
      {#snippet item(tone)}
        {@const Icon = TONE_ICON[tone]}
        <IconChip size="md" {tone}><Icon /></IconChip>
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!-- One column of chips is one shape. `sm` beside a label and value is the common case. -->
<Story name="In a detail list" asChild>
  <OnACard>
    <div class="flex max-w-xs flex-col gap-4">
      {#each facts as fact}
        <div class="flex items-center gap-3">
          <IconChip><fact.icon /></IconChip>
          <div class="flex min-w-0 flex-col">
            <span class="text-muted-foreground text-xs">{fact.label}</span>
            <span class="truncate text-sm font-medium">{fact.value}</span>
          </div>
        </div>
      {/each}
    </div>
  </OnACard>
</Story>
