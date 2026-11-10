<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBulb from '@tabler/icons-svelte-runes/icons/bulb'
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle'
  import IconShieldCheck from '@tabler/icons-svelte-runes/icons/shield-check'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Card from '../card/card.svelte'
  import CardContent from '../card/card-content.svelte'
  import AsideCard from './aside-card.svelte'

  const { Story } = defineMeta({
    title: 'Layout/AsideCard',
    component: AsideCard,
    tags: ['mise'],
    args: { title: 'Tips', open: true },
  })
</script>

{#snippet bulb()}
  <IconBulb />
{/snippet}
{#snippet info()}
  <IconInfoCircle />
{/snippet}
{#snippet shield()}
  <IconShieldCheck />
{/snippet}

{#snippet tips()}
  <ul class="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
    <li>The company name appears on every receipt.</li>
    <li>The industry decides which features are on by default.</li>
  </ul>
{/snippet}

<!--
  Guidance beside a form, folding away once read: the answer stays available
  without staying in the way.
-->
<Story name="Playground">
  {#snippet template(args)}
    <div class="max-w-sm">
      <AsideCard {...args} icon={bulb} title={args.title ?? 'Tips'} children={tips} />
    </div>
  {/snippet}
</Story>

<!-- Open, and collapsed to start, for a card that repeats on every step of a flow. -->
<Story name="States" asChild>
  <StoryAxis values={['open', 'collapsed'] as const} orientation="vertical">
    {#snippet item(state)}
      <div class="w-80">
        <AsideCard icon={bulb} title="Tips" open={state === 'open'} children={tips} />
      </div>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  In place: the form takes the column, the aside takes 360px, and the split
  only happens at `xl`. Below that the aside drops under the form rather than
  squeezing it, because a form squeezed to half a tablet is worse than a scroll.
-->
<Story name="Beside a form" asChild>
  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
    <Card class="h-fit">
      <CardContent class="text-muted-foreground py-16 text-center text-sm">Form fields</CardContent>
    </Card>
    <aside class="grid h-fit grid-cols-1 gap-4 md:max-xl:grid-cols-2">
      <AsideCard icon={info} title="What this step does">
        <p class="text-muted-foreground text-sm">
          Creates the location record. Nothing is set up yet.
        </p>
      </AsideCard>
      <AsideCard icon={shield} title="Before you continue">
        <p class="text-muted-foreground text-sm">
          The name cannot be changed after receipts have been issued.
        </p>
      </AsideCard>
    </aside>
  </div>
</Story>
