<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import Progress from './progress.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/Progress',
    component: Progress,
    tags: ['shadcn'],
    args: { value: 64 },
    argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  })
</script>

<!--
  The bare bar. `MetricBar` and `MetricRow` colour it through
  `TONE_INDICATOR_CLASS`; reach for `Progress` directly when there is no label
  or figure beside it.
-->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><Progress {...args} class="w-72" /></OnACard>
  {/snippet}
</Story>
