<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconArrowUpRight from '@tabler/icons-svelte-runes/icons/arrow-up-right'
  import IconDots from '@tabler/icons-svelte-runes/icons/dots'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'
  import IconTrash from '@tabler/icons-svelte-runes/icons/trash'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import StoryMatrix from '../../../../../stories/story-matrix.svelte'
  import { TONES } from '../../../utils/tone.js'
  import Button from './button.svelte'
  import type { ButtonVariant } from './button-variants.js'

  const VARIANTS: ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost', 'link']
  const SIZES = ['sm', 'md', 'lg'] as const

  const { Story } = defineMeta({
    title: 'Actions/Button',
    component: Button,
    tags: ['shadcn'],
    argTypes: {
      variant: { control: 'inline-radio', options: VARIANTS },
      tone: { control: 'select', options: [undefined, ...TONES] },
      size: { control: 'inline-radio', options: SIZES },
    },
  })
</script>

<!-- Every prop, for poking at in the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><Button {...args}>Save changes</Button></OnACard>
  {/snippet}
</Story>

<!--
  Five treatments × six tones. Every colour comes from the semantic tokens.
  Most of this grid should never ship; the stories below are the combinations a
  screen actually wants.
-->
<Story name="Matrix" asChild>
  <OnACard>
    <StoryMatrix rows={VARIANTS} columns={TONES}>
      {#snippet cell(variant, tone)}
        <Button {variant} {tone} size="sm">{variant}</Button>
      {/snippet}
    </StoryMatrix>
  </OnACard>
</Story>

<!--
  `md` is the default. Keep one size per row: buttons of different sizes side
  by side do not line up.
-->
<Story name="Sizes" asChild>
  <OnACard>
    <StoryAxis values={SIZES}>
      {#snippet item(size)}
        <Button {size}>Save changes</Button>
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  The pair almost every form ends on. `tone` is left off both: a solid button
  defaults to the brand and everything else to neutral, so an outline Cancel
  beside a solid Save is not also brand-coloured.
-->
<Story name="Primary and secondary" asChild>
  <OnACard>
    <div class="flex items-center gap-3">
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  </OnACard>
</Story>

<!--
  A destructive action is `tone="critical"`, and how loud it is depends on where
  it sits. In a list of row actions it is `ghost`, red ink with no fill, because
  the row is not yet asking anything. In the dialog that confirms it, it is
  `solid`: now it is the question.
-->
<Story name="Destructive" asChild>
  <OnACard>
    <div class="flex items-center gap-6">
      <Button variant="ghost" tone="critical" size="sm">
        <IconTrash />
        Remove line
      </Button>
      <Button tone="critical">Close location</Button>
    </div>
  </OnACard>
</Story>

<!--
  `iconOnly` makes the button square and round at any size. It needs an
  `aria-label`: there is no text for a screen reader to read.

  The last one is a row's ⋯ menu trigger: `soft` so it reads as a control at
  rest, and it holds its wash while the menu is open.
-->
<Story name="Icon only" asChild>
  <OnACard>
    <div class="flex items-center gap-3">
      <Button iconOnly size="sm" aria-label="Add"><IconPlus /></Button>
      <Button iconOnly variant="outline" aria-label="Add"><IconPlus /></Button>
      <Button iconOnly variant="ghost" size="lg" aria-label="Add"><IconPlus /></Button>
      <Button iconOnly variant="soft" size="sm" aria-label="Row actions">
        <IconDots />
      </Button>
    </div>
  </OnACard>
</Story>

<!--
  `href` renders a link that looks like a button, which is what the React
  package's `asChild` was used for. A disabled link drops its href and leaves
  the tab order.
-->
<Story name="As a link" asChild>
  <OnACard>
    <div class="flex items-center gap-3">
      <Button href="#orders" variant="outline">
        Open orders
        <IconArrowUpRight />
      </Button>
      <Button href="#orders" variant="outline" disabled>Disabled link</Button>
    </div>
  </OnACard>
</Story>
