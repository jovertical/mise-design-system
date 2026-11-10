<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'

  import StatTile from '../../data-display/stat-tile/stat-tile.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Hint from './hint.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/Hint',
    component: Hint,
    tags: ['mise'],
    args: { label: 'What counts as pairing' },
  })
</script>

{#snippet packageIcon()}
  <IconPackage />
{/snippet}

{#snippet pairingHint()}
  <Hint label="What counts as pairing">
    Devices that have claimed a code but not yet completed provisioning. They drop off this figure
    once the sync engine reports in.
  </Hint>
{/snippet}

{#snippet capacityHint()}
  <Hint label="What counts toward capacity">
    Provisioned databases against the plan's ceiling. Locations mid-onboarding count from the moment
    their database is created, not from activation.
  </Hint>
{/snippet}

<!--
  The `?` that explains the thing it sits beside. Focus it, or hover it, to
  read the explanation.

  The `label` is what a screen reader announces in place of the glyph, so it
  should name what is being explained rather than say "Help".
-->
<Story name="Playground">
  {#snippet template(args)}
    <span class="text-foreground flex items-center gap-1.5 text-sm font-medium">
      Devices pairing
      <Hint label={args.label}>
        Devices that have claimed a code but not yet completed provisioning. They drop off this
        figure once the sync engine reports in.
      </Hint>
    </span>
  {/snippet}
</Story>

<!--
  On a card's heading. `CardTitle` is a flex row, so the trigger needs no
  arranging: it sits on the title's baseline.
-->
<Story name="In a card title" asChild>
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
  `StatTile` takes one as a `hint`, which is the slot this is named for. It
  belongs to the caption it explains rather than to the tile's corner: beside
  the icon chip it put two competing targets in the same 40px.
-->
<Story name="In a stat tile" asChild>
  <div class="max-w-xs">
    <StatTile label="Devices pairing" value="18" icon={packageIcon} hint={pairingHint} />
  </div>
</Story>

<!--
  Where it does **not** belong: a figure the reader can act on directly, and a
  caption that could simply have said the thing.

  A `?` is a cost: it hides the sentence behind a hover or a press. It earns
  that when the explanation is longer than a caption can hold and only some
  readers need it. "Total locations" needs no hint; "Capacity used" does,
  because what counts toward capacity is a rule nobody can guess.
-->
<Story name="When not to" asChild>
  <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
    <StatTile label="Total locations" value="248" />
    <StatTile label="Capacity used" value="61%" hint={capacityHint} />
  </div>
</Story>
