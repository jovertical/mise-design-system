<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconAlertCircle from '@tabler/icons-svelte-runes/icons/alert-circle'
  import IconArrowDown from '@tabler/icons-svelte-runes/icons/arrow-down'
  import IconArrowUp from '@tabler/icons-svelte-runes/icons/arrow-up'
  import IconBookmark from '@tabler/icons-svelte-runes/icons/bookmark'
  import IconCircleCheck from '@tabler/icons-svelte-runes/icons/circle-check'
  import IconClipboardCheck from '@tabler/icons-svelte-runes/icons/clipboard-check'
  import IconClipboardList from '@tabler/icons-svelte-runes/icons/clipboard-list'
  import IconCoin from '@tabler/icons-svelte-runes/icons/coin'
  import IconFileText from '@tabler/icons-svelte-runes/icons/file-text'
  import IconListCheck from '@tabler/icons-svelte-runes/icons/list-check'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'
  import IconPackageOff from '@tabler/icons-svelte-runes/icons/package-off'
  import IconScale from '@tabler/icons-svelte-runes/icons/scale'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
  import IconTruck from '@tabler/icons-svelte-runes/icons/truck'
  import IconWallet from '@tabler/icons-svelte-runes/icons/wallet'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import { TONES } from '../../../utils/tone.js'
  import Button from '../../actions/button/button.svelte'
  import Progress from '../../feedback/progress/progress.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import DeltaBadge from '../delta-badge/delta-badge.svelte'
  import Sparkline from '../sparkline/sparkline.svelte'
  import StatTile from './stat-tile.svelte'

  const { Story } = defineMeta({
    title: 'Data display/StatTile',
    component: StatTile,
    tags: ['mise'],
    args: { label: 'On hand', value: '147', description: 'Stock available' },
    argTypes: {
      size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
      surface: { control: 'inline-radio', options: ['card', 'inset'] },
      tone: { control: 'select', options: TONES },
      iconTone: { control: 'select', options: TONES },
      iconPosition: { control: 'inline-radio', options: ['left', 'right'] },
      iconAlignment: { control: 'inline-radio', options: ['center', 'top'] },
      iconShape: { control: 'inline-radio', options: ['square', 'circle'] },
      loading: { control: 'boolean' },
      error: { control: 'boolean' },
      applyToneToIcon: { control: 'boolean' },
    },
  })

  const row4 = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4'
</script>

{#snippet packageIcon()}
  <IconPackage />
{/snippet}
{#snippet dollarIcon()}
  <IconCoin />
{/snippet}
{#snippet cartIcon()}
  <IconShoppingCart />
{/snippet}
{#snippet alertIcon()}
  <IconAlertCircle />
{/snippet}
{#snippet checkIcon()}
  <IconCircleCheck />
{/snippet}
{#snippet clipboardCheckIcon()}
  <IconClipboardCheck />
{/snippet}
{#snippet clipboardListIcon()}
  <IconClipboardList />
{/snippet}
{#snippet scaleIcon()}
  <IconScale />
{/snippet}
{#snippet walletIcon()}
  <IconWallet />
{/snippet}
{#snippet packageXIcon()}
  <IconPackageOff />
{/snippet}
{#snippet rising()}
  <DeltaBadge value={15.7} />
{/snippet}
{#snippet fewerFailures()}
  <DeltaBadge value={-2.8} invert />
{/snippet}
{#snippet accuracyDelta()}
  <DeltaBadge value={-0.6} unit=" pt" invert />
{/snippet}
{#snippet viewAll()}
  <Button variant="outline" size="sm" href="#all">View all</Button>
{/snippet}
{#snippet accuracyLine()}
  <span class="inline-flex items-center gap-1">
    <DeltaBadge value={-0.6} unit=" pt" invert variant="plain" />
    vs 5 Feb – 29 Apr 2026
  </span>
{/snippet}
{#snippet revenueLine()}
  <span class="inline-flex items-center gap-1">
    <DeltaBadge value={2.1} variant="plain" />
    vs 5 Feb – 29 Apr 2026
  </span>
{/snippet}

<!-- Every prop, for the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <div class="max-w-xs"><StatTile icon={packageIcon} {...args} /></div>
  {/snippet}
</Story>

<!--
  Size names a density, not a type step: `sm` for a dense row or a figure in
  another card, `md` four across, `lg` one or two across or the point of the
  screen. One size used to be `text-3xl`, which is more than a four-across tile
  can hold once the figure is money.
-->
<Story name="Sizes" asChild>
  <StoryAxis values={['sm', 'md', 'lg'] as const} orientation="vertical">
    {#snippet item(size)}
      <StatTile class="max-w-xs" label="Tracked items" value="1,284" {size} icon={packageIcon} />
    {/snippet}
  </StoryAxis>
</Story>

<!--
  `inset` is the same tile inside a card: the summary over the chart or table
  that is its evidence, recessed, with a small upper-case caption that does not
  compete with the card's title.
-->
<Story name="Surfaces" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="On a card"
      value="+823"
      tone="success"
      description="Its own surface and shadow."
      icon={packageIcon}
    />
    <Card>
      <CardHeader><CardTitle>Stock movement</CardTitle></CardHeader>
      <CardContent>
        <StatTile
          surface="inset"
          label="Net change"
          value="+823"
          tone="success"
          description="Stock is coming in faster than it leaves."
          rows={[
            { id: 'in', label: 'Stock in', value: '+910' },
            { id: 'out', label: 'Stock out', value: '−87' },
          ]}
        />
      </CardContent>
    </Card>
  </div>
</Story>

<!--
  Loading and error keep the tile's height: a row of four where one has
  collapsed is worse than one where a tile says it has no answer.
-->
<Story name="States" asChild>
  <div class="grid gap-4 sm:grid-cols-3">
    <StatTile label="Total orders" value="159" description="Lifetime to date" icon={cartIcon} />
    <StatTile
      label="Open order value"
      value={null}
      description="Orders in progress"
      icon={walletIcon}
      loading
    />
    <StatTile
      label="Lifetime value"
      value="$1,627,280"
      description="Billable revenue to date"
      icon={dollarIcon}
      error
    />
  </div>
</Story>

<!--
  `unit` says what the figure counts, on its own small line under it. Beside
  the figure, a delta and a visual made every tile in a row wrap at a
  different point.
-->
<Story name="With units" asChild>
  <div class={row4}>
    <StatTile
      label="Order accuracy"
      value="98.6%"
      description="1,204 orders checked"
      icon={clipboardCheckIcon}
      iconTone="success"
    />
    <StatTile
      label="Avg prep time"
      value="4.5"
      unit="min"
      description="Placed to ready for pickup"
      icon={clipboardListIcon}
      iconTone="info"
    />
    <StatTile
      label="Avg basket size"
      value="3.4"
      unit="items"
      description="Per completed sale"
      icon={scaleIcon}
      iconTone="info"
    />
    <StatTile
      label="Failed payments"
      value="1.2%"
      description="Declined at the terminal"
      tone="critical"
      icon={alertIcon}
      iconTone="critical"
    />
  </div>
</Story>

<!-- `delta` sits after the figure, so `$45.6k ↗ +15.7%` reads as one statement. -->
<Story name="With delta" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="Inventory value"
      value="$45.6k"
      description="vs previous 30 days"
      icon={dollarIcon}
      iconPosition="left"
      delta={rising}
    />
    <StatTile
      label="Failed payments"
      value="1.2%"
      description="Declined at the terminal"
      icon={alertIcon}
      iconTone="critical"
      delta={fewerFailures}
    />
  </div>
</Story>

<!--
  A delta sharing a line with the description wants `variant="plain"` inside
  `description`, not the `delta` slot (left): a tinted pill beside muted text
  reads as two things bumping into each other.
-->
<Story name="With plain delta" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="Order accuracy"
      value="98.6%"
      description="1,204 orders checked"
      delta={accuracyDelta}
      icon={clipboardCheckIcon}
      iconTone="success"
    />
    <StatTile
      label="Order accuracy"
      value="98.6%"
      description={accuracyLine}
      icon={clipboardCheckIcon}
      iconTone="success"
    />
  </div>
</Story>

<!--
  `action` leaves the card: a link out to what the figure summarises, on the
  label's line. Keep it short; the label and the action share that line.
-->
<Story name="With corner action" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="Locations"
      value="12"
      description="Trading on this account"
      icon={cartIcon}
      iconPosition="left"
      action={viewAll}
    />
    <StatTile
      label="Inventory value"
      value="$45.6k"
      description="vs previous 30 days"
      icon={dollarIcon}
      iconPosition="left"
      delta={rising}
      action={viewAll}
    />
  </div>
</Story>

<!-- `footer` sits below everything: a bar, a total, a second figure qualifying the first. -->
<Story name="With footer" asChild>
  <div class="grid gap-4 sm:grid-cols-3">
    <StatTile label="Total items" value="28" icon={packageIcon} iconPosition="left">
      {#snippet footer()}
        <p class="text-muted-foreground border-t pt-3 text-xs">+3 added · 4 locations</p>
      {/snippet}
    </StatTile>
    <StatTile
      label="Low stock"
      value="9"
      tone="warning"
      description="3 urgent"
      icon={alertIcon}
      iconPosition="left"
    >
      {#snippet footer()}
        <Progress value={64} />
      {/snippet}
    </StatTile>
    <StatTile
      label="Out of stock"
      value="4"
      tone="critical"
      icon={packageXIcon}
      iconPosition="left"
    >
      {#snippet footer()}
        <div class="flex items-center justify-between border-t pt-3 text-xs">
          <span class="text-muted-foreground">Revenue at risk</span>
          <span class="text-destructive font-medium tabular-nums">$5,227</span>
        </div>
      {/snippet}
    </StatTile>
  </div>
</Story>

<!--
  `visual`, a shape beside the figure. It takes half the row and yields: the
  figure is what the tile is for, the shape a remark about it.
-->
<Story name="With visual" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="Transactions"
      value="1,284"
      unit="orders"
      delta={rising}
      icon={cartIcon}
      iconTone="primary"
      iconPosition="left"
    >
      {#snippet visual()}
        <Sparkline data={[4, 6, 5, 9, 8, 12, 11, 15]} height={36} />
      {/snippet}
    </StatTile>
    <StatTile
      label="Gross revenue"
      value="$45.6k"
      exactValue="$45,612.40"
      delta={rising}
      icon={dollarIcon}
      iconTone="primary"
      iconPosition="left"
    >
      {#snippet visual()}
        <Sparkline data={[8, 7, 9, 11, 10, 14, 16, 19]} tone="success" height={36} />
      {/snippet}
    </StatTile>
  </div>
</Story>

<!--
  `rows` qualify the figure, and the tile owns the rules between them. A row's
  tone is for a directional pair (right: stock in against out), not two ends of
  a spread (left), and it is all or nothing within a group.
-->
<Story name="With rows" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="Average turnover"
      value="5.8x"
      size="lg"
      description="Stock is moving faster than last period."
      rows={[
        { id: 'best', label: 'Best category', value: '8.4x' },
        { id: 'slowest', label: 'Slowest category', value: '2.3x' },
      ]}
    >
      {#snippet delta()}
        <DeltaBadge value={0.7} unit="x" />
      {/snippet}
    </StatTile>
    <StatTile
      surface="inset"
      label="Net change"
      value="+823"
      tone="success"
      description="106 movements recorded."
      rows={[
        { id: 'in', label: 'Stock in', value: '+910', tone: 'success' },
        { id: 'out', label: 'Stock out', value: '−87', tone: 'critical' },
      ]}
    />
  </div>
</Story>

<!-- The shape it was drawn for: caption, figure, a muted line, the icon out of the reading path. Four across. -->
<Story name="Four across" asChild>
  <div class={row4}>
    <StatTile
      label="Total transfers"
      value="21"
      description="All stock transfers"
      icon={clipboardListIcon}
      iconTone="success"
    />
    <StatTile label="Draft" value="4" description="19% of total" icon={fileTextIcon} />
    <StatTile
      label="In transit"
      value="6"
      description="29% of total"
      icon={truckIcon}
      iconTone="info"
    />
    <StatTile
      label="Completed"
      value="9"
      description="43% of total"
      icon={packageIcon}
      iconTone="success"
    />
  </div>
</Story>

<!-- `tone` colours the figure only, and only for a figure with a direction. A total stays in ink. -->
<Story name="Toned" asChild>
  <div class={row4}>
    <StatTile
      label="Total in"
      value="+6,268"
      description="Units received"
      icon={arrowDownIcon}
      iconTone="success"
    />
    <StatTile
      label="Total out"
      value="-4,890"
      description="Units shipped"
      tone="critical"
      icon={arrowUpIcon}
      iconTone="critical"
    />
    <StatTile
      label="Net change"
      value="+1,378"
      description="Inbound − outbound"
      icon={scaleIcon}
      iconTone="info"
    />
    <StatTile
      label="Movements"
      value="2,017"
      description="Ledger entries"
      icon={listChecksIcon}
      iconTone="success"
    />
  </div>
</Story>

<!-- `iconPosition="left"` puts the chip first, for an icon that carries meaning rather than decoration. -->
<Story name="Icon leading" asChild>
  <div class="grid gap-4 sm:grid-cols-3">
    <StatTile
      label="On hand"
      value="147"
      description="Stock available"
      icon={packageIcon}
      iconTone="info"
      iconPosition="left"
    />
    <StatTile
      label="Reserved"
      value="6"
      description="Held for orders"
      icon={bookmarkIcon}
      iconTone="warning"
      iconPosition="left"
    />
    <StatTile
      label="Available"
      value="141"
      description="Ready to sell"
      icon={checkIcon}
      iconTone="success"
      iconPosition="left"
    />
  </div>
</Story>

<!--
  Every icon tone. `neutral` is the default and the rule; tinted chips are
  opt-in per tile, because a row where every chip is coloured has no emphasis
  left to spend.
-->
<Story name="Icon tones" asChild>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each TONES as iconTone (iconTone)}
      <StatTile label={iconTone} value="12" icon={packageIcon} {iconTone} iconPosition="left" />
    {/each}
  </div>
</Story>

<!--
  `applyToneToIcon` derives the chip from `tone`, so one threshold colours both
  and the two cannot drift. For a row where the chip is what gets scanned, such
  as a health strip, not a dashboard summary.
-->
<Story name="Tone applied to icon" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="Uptime"
      value="99.2%"
      description="Healthy: neutral tone, so a neutral chip."
      icon={checkIcon}
      iconPosition="left"
      applyToneToIcon
    />
    <StatTile
      label="Uptime"
      value="61.4%"
      tone="critical"
      description="Degraded: one prop colours both."
      icon={alertIcon}
      iconPosition="left"
      applyToneToIcon
    />
  </div>
</Story>

<!--
  `iconSize` is the chip, `size` the figure. All three tiles are `size="md"`;
  only the chip's footprint changes.
-->
<Story name="Icon sizes" asChild>
  <div class="grid gap-4 sm:grid-cols-3">
    <StatTile
      label="Small chip"
      value="$427,145.00"
      description="The chip reads as ornament."
      icon={dollarIcon}
      iconTone="success"
      iconSize="sm"
    />
    <StatTile
      label="Medium chip"
      value="1,284"
      description="The default: tracks size."
      icon={packageIcon}
    />
    <StatTile
      label="Large chip"
      value="128"
      description="The chip leads."
      icon={cartIcon}
      iconTone="info"
      iconSize="lg"
    />
  </div>
</Story>

<!--
  `iconAlignment="top"` (right) pins the chip to the label line, for a column a
  delta line has grown tall enough that a centred chip (left) drifts below the
  label.
-->
<Story name="Icon alignment" asChild>
  <div class="grid gap-4 sm:grid-cols-2">
    <StatTile
      label="Revenue"
      value="$427,145.00"
      description={revenueLine}
      icon={dollarIcon}
      iconTone="success"
    />
    <StatTile
      label="Revenue"
      value="$427,145.00"
      description={revenueLine}
      icon={dollarIcon}
      iconTone="success"
      iconAlignment="top"
    />
  </div>
</Story>

<!--
  Money: abbreviate, and keep the exact figure on hover through `exactValue`.
  The abbreviation is the caller's, since currency and locale are tenant
  settings; the way back to the exact figure is the tile's.
-->
<Story name="Money" asChild>
  <div class={row4}>
    <StatTile
      label="Gross revenue"
      value="$45.6k"
      exactValue="$45,612.40"
      delta={rising}
      description="vs previous 30 days"
      icon={dollarIcon}
      iconTone="success"
    />
    <StatTile
      label="Average ticket"
      value="$312"
      exactValue="$311.84"
      unit="per order"
      description="Across 146 orders"
      icon={walletIcon}
    />
    <StatTile
      label="Tax collected"
      value="$5.4k"
      exactValue="$5,433.12"
      description="Sales tax"
      icon={scaleIcon}
    />
    <StatTile
      label="Discounts given"
      value="$1.2k"
      exactValue="$1,204.55"
      tone="warning"
      description="2.6% of gross"
      icon={cartIcon}
    />
  </div>
</Story>

<!--
  `iconShape`: a chip holding initials is a circle, and that wins over the row;
  icon chips take the shape the screen picked, every one the same. The last row
  is the failure: one round icon chip for no reason.
-->
<Story name="Icon shapes" asChild>
  <div class="flex flex-col gap-6">
    {#each [
      {
        caption: 'Icon chips, square across the row: the default',
        shapes: ['square', 'square', 'square'],
      },
      {
        caption: 'Icon chips, circle across the row: also correct',
        shapes: ['circle', 'circle', 'circle'],
      },
      {
        caption: 'Mixed with no reason: wrong, the row reads as two components',
        shapes: ['circle', 'square', 'square'],
      },
    ] as row (row.caption)}
      <div>
        <p class="text-muted-foreground mb-2 text-xs">{row.caption}</p>
        <div class="grid gap-4 sm:grid-cols-3">
          <StatTile
            label="Tracked items"
            value="1,284"
            icon={packageIcon}
            iconShape={row.shapes[0] as 'square' | 'circle'}
            iconPosition="left"
          />
          <StatTile
            label="Low stock"
            value="9"
            icon={scaleIcon}
            iconShape={row.shapes[1] as 'square' | 'circle'}
            iconPosition="left"
          />
          <StatTile
            label="Out of stock"
            value="4"
            icon={packageXIcon}
            iconShape={row.shapes[2] as 'square' | 'circle'}
            iconPosition="left"
          />
        </div>
      </div>
    {/each}
    <div>
      <p class="text-muted-foreground mb-2 text-xs">
        Mixed, and correct: the round chip is a person
      </p>
      <div class="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Customer"
          value="Ana Cruz"
          description="ana@example.org"
          iconShape="circle"
          iconPosition="left"
        >
          {#snippet icon()}
            <span class="text-xs font-medium">AC</span>
          {/snippet}
        </StatTile>
        <StatTile label="Payment" value="Cash" icon={walletIcon} iconPosition="left" />
        <StatTile
          label="Transaction value"
          value="$1,284.00"
          icon={dollarIcon}
          iconPosition="left"
        />
      </div>
    </div>
  </div>
</Story>

{#snippet fileTextIcon()}
  <IconFileText />
{/snippet}
{#snippet truckIcon()}
  <IconTruck />
{/snippet}
{#snippet arrowDownIcon()}
  <IconArrowDown />
{/snippet}
{#snippet arrowUpIcon()}
  <IconArrowUp />
{/snippet}
{#snippet listChecksIcon()}
  <IconListCheck />
{/snippet}
{#snippet bookmarkIcon()}
  <IconBookmark />
{/snippet}
