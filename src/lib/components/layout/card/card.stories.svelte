<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconArrowUpRight from '@tabler/icons-svelte-runes/icons/arrow-up-right'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Button from '../../actions/button/button.svelte'
  import FactList from '../../data-display/fact-list/fact-list.svelte'
  import FactListItem from '../../data-display/fact-list/fact-list-item.svelte'
  import MetricBar from '../../data-display/metric-bar/metric-bar.svelte'
  import RadialStat from '../../data-display/radial-stat/radial-stat.svelte'
  import Hint from '../../overlays/hint/hint.svelte'
  import CardList from '../card-list/card-list.svelte'
  import Separator from '../separator/separator.svelte'
  import Card from './card.svelte'
  import CardAction from './card-action.svelte'
  import CardContent from './card-content.svelte'
  import CardDescription from './card-description.svelte'
  import CardFooter from './card-footer.svelte'
  import CardHeader from './card-header.svelte'
  import CardTitle from './card-title.svelte'

  const { Story } = defineMeta({
    title: 'Layout/Card',
    component: Card,
    tags: ['shadcn'],
    argTypes: { variant: { control: 'inline-radio', options: ['default', 'ghost'] } },
  })
</script>

{#snippet warehouse()}
  <IconBuildingWarehouse />
{/snippet}

<!--
  The common shape: header, title, description, content.

  Padding is `--card-spacing`, 20px on both axes, declared on `Card` and read by
  the header, content and footer. It is a variable rather than a literal so a
  full-bleed child can cancel it.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-lg" {...args}>
      <CardHeader>
        <CardTitle>Stock by location</CardTitle>
        <CardDescription>Capacity and low-stock risk by location.</CardDescription>
      </CardHeader>
      <CardContent class="text-muted-foreground text-sm">
        Four locations reporting, 1,378 units on hand.
      </CardContent>
    </Card>
  {/snippet}
</Story>
<!--
  `ghost` drops the surface entirely: no ring, no shadow, no padding. For a block
  that wants the card's layout without looking like a card. `default` and
  `ghost` are the only two variants.
-->
<Story name="Variants" asChild>
  <StoryAxis values={['default', 'ghost'] as const} orientation="vertical">
    {#snippet item(variant)}
      <Card {variant} class="max-w-lg">
        <CardHeader class={variant === 'ghost' ? 'px-0' : ''}>
          <CardTitle>{variant === 'ghost' ? 'Not a surface' : 'A surface'}</CardTitle>
          <CardDescription
            >Same structure, {variant === 'ghost' ? 'no' : 'a'} panel under it.</CardDescription
          >
        </CardHeader>
        <CardContent class="text-muted-foreground text-sm {variant === 'ghost' ? 'px-0' : ''}">
          Useful when a section needs the card's rhythm but sits on the page.
        </CardContent>
      </Card>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  `CardAction` is the header's right-hand slot: a link out, a filter, a period
  switch. It lands in a second grid column, so the title and description keep
  their own width rather than wrapping around it.
-->
<Story name="With action" asChild>
  <Card class="max-w-lg">
    <CardHeader>
      <CardTitle>Stock turnover</CardTitle>
      <CardDescription>Average stock turns over the selected period.</CardDescription>
      <CardAction>
        <Button variant="outline" size="sm">View all</Button>
      </CardAction>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">5.8× this period.</CardContent>
  </Card>
</Story>

<!--
  A footer, and the rule above it. `divided` is `border-t` plus the padding that
  makes the rule sit right, the mirror of `CardHeader`'s `divided`.
-->
<Story name="With footer" asChild>
  <Card class="max-w-lg">
    <CardHeader>
      <CardTitle>Close location</CardTitle>
      <CardDescription>This cannot be undone once stock has been moved.</CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">
      Riverside holds 398 units across 22 items.
    </CardContent>
    <CardFooter divided class="justify-end">
      <Button variant="outline" size="sm">Cancel</Button>
    </CardFooter>
  </Card>
</Story>

<!--
  `variant="muted"` is the recessed band: a wash, its own bottom radius matching
  the card's, and looser vertical padding. For a footer reporting a count or a
  status rather than holding actions: "7 registers", "Awaiting sync".
-->
<Story name="With muted footer" asChild>
  <Card class="max-w-lg">
    <CardHeader>
      <CardTitle>Paired registers</CardTitle>
      <CardDescription>Registers currently checked in at this location.</CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">
      3 registers reporting, last sync 2 minutes ago.
    </CardContent>
    <CardFooter variant="muted" divided>7 registers total</CardFooter>
  </Card>
</Story>

<!--
  A leading glyph marks where a section starts. Bare and muted by default, so
  the heading labels the section rather than competing with what is inside it.
-->
<Story name="With icon" asChild>
  <Card class="max-w-sm">
    <CardHeader><CardTitle icon={warehouse}>Supplier information</CardTitle></CardHeader>
    <CardContent class="text-muted-foreground text-sm">Who they are.</CardContent>
  </Card>
</Story>

<!--
  `iconTone="primary"` draws the glyph in a chip, for a long form where the
  headings are the page's structure and a bare glyph stops registering as a
  landmark. Never a status tone.
-->
<Story name="With tinted icon" asChild>
  <Card class="max-w-sm">
    <CardHeader>
      <CardTitle icon={warehouse} iconTone="primary">Supplier information</CardTitle>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">Who they are.</CardContent>
  </Card>
</Story>

<!--
  A heading that needs qualifying takes a hint, not a figure in `CardAction`.

  `CardAction` is where a card puts something the reader can do, and a count
  parked there reads as one. A `?` next to the title says the thing a heading
  cannot fit, and says it only to whoever asks. `CardTitle` is a flex row, so
  the trigger needs no arranging.
-->
<Story name="With hint" asChild>
  <Card class="max-w-lg">
    <CardHeader>
      <CardTitle>
        Stock health by category
        <Hint label="How stock health is calculated">
          Available stock measured against the reorder point set on each category. Categories with
          no reorder point are excluded.
        </Hint>
      </CardTitle>
      <CardDescription>Available stock against recommended inventory levels</CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">Six categories reporting.</CardContent>
  </Card>
</Story>

<!--
  Content with no header. A card that is a surface rather than a titled section:
  a form panel, a summary block, anything whose heading lives outside it.
-->
<Story name="Content only" asChild>
  <Card class="max-w-lg">
    <CardContent class="text-muted-foreground text-sm">
      A bare surface. The page above it already said what this is.
    </CardContent>
  </Card>
</Story>

<!--
  A footer that is one wide target, running to the card's edges.

  `bleed` cancels the card's bottom padding, drops the horizontal padding and
  rounds the bottom corners: three things that have to happen together, which
  is why they are one prop. Without it the button floats above a band of card
  it cannot reach, and its square corners sit over the card's curve.

  For "see the rest of this" rather than for actions on the content above. A
  footer holding a Save and a Cancel wants the padded default.
-->
<Story name="Bleed footer link" asChild>
  <Card class="max-w-sm">
    <CardHeader>
      <CardTitle>Stock items</CardTitle>
      <CardDescription>20 items</CardDescription>
    </CardHeader>

    <CardContent>
      <ul class="flex flex-col gap-1">
        {#each ['All-purpose flour', 'Arborio rice', 'Baguette'] as item}
          <li class="flex items-center gap-2 rounded-xl border bg-card px-2 py-1.5 text-sm">
            <span class="min-w-0 flex-1 truncate">{item}</span>
            <span class="shrink-0 text-xs text-muted-foreground">kg</span>
          </li>
        {/each}
      </ul>
    </CardContent>

    <CardFooter bleed divided>
      <Button variant="ghost" class="h-12 w-full justify-between rounded-none">
        View all stock items
        <IconArrowUpRight class="size-4" />
      </Button>
    </CardFooter>
  </Card>
</Story>

<!--
  A list of rows, divided edge to edge. `CardList` cancels the card's
  horizontal padding and hands it back to each row, so the rules reach the
  card's edges while the rows still line up with the header. It has to sit in a
  padded `CardContent`: `px-0` there as well cancels it twice.
-->
<Story name="As a list" asChild>
  <Card class="max-w-lg">
    <CardHeader divided><CardTitle>Stock by location</CardTitle></CardHeader>
    <CardContent>
      <CardList>
        {#each [
          { name: 'Riverside', where: 'North district · 22 items', used: 398, cap: 500 },
          { name: 'Harbour', where: 'Waterfront · 19 items', used: 321, cap: 500 },
        ] as row (row.name)}
          {#snippet icon()}
            <IconBuildingStore />
          {/snippet}
          <MetricBar
            {icon}
            label={row.name}
            description={row.where}
            value="{Math.round((row.used / row.cap) * 100)}%"
            percent={(row.used / row.cap) * 100}
            trailing="{row.used} / {row.cap} units"
          />
        {/each}
      </CardList>
    </CardContent>
  </Card>
</Story>

<!--
  A card whose subject is one figure: the ring, what it counts, then the facts
  that qualify it. The ring answers "roughly how far", the line under it "how
  far exactly", the rows "and what that means". The footer's one action runs the
  full width.
-->
<Story name="Progress panel" asChild>
  <Card class="max-w-sm">
    <CardHeader><CardTitle>Import progress</CardTitle></CardHeader>
    <CardContent stack="md" class="items-center">
      <RadialStat percent={25} diameter={140} aria-label="25 percent complete">
        <div class="text-center">
          <div class="font-heading text-2xl font-semibold tabular-nums">25%</div>
          <div class="text-muted-foreground text-xs">complete</div>
        </div>
      </RadialStat>
      <p class="text-sm font-medium tabular-nums">247 of 1,000 records written</p>
      <Separator />
      <FactList class="w-full">
        <FactListItem label="Started" value="08:14" />
        <FactListItem label="Running for" value="2m 14s" />
        <FactListItem label="Rejected so far" value="0" />
      </FactList>
    </CardContent>
    <CardFooter divided>
      <Button variant="outline" class="w-full">View all imports</Button>
    </CardFooter>
  </Card>
</Story>
