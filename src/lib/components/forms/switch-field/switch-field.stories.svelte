<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import SwitchField from './switch-field.svelte'

  const { Story } = defineMeta({
    title: 'Forms/SwitchField',
    component: SwitchField,
    tags: ['mise'],
    args: {
      id: 'collect-tax',
      label: 'Collect tax at this location',
      description: 'Applies the default rate unless overridden below.',
      checked: false,
    },
    argTypes: { variant: { control: 'inline-radio', options: ['default', 'flush'] } },
  })

  const revealed = $state({ on: false })
  const stacked = $state({ retail: true, production: false, storage: true })
  const bordered = $state({ retail: true, production: false, storage: true })
  const flush = $state({ tax: true, inclusive: false })
</script>

<!-- A switch that stands alone in a form, on its own bordered surface. -->
<Story name="Playground">
  {#snippet template(args)}
    <div class="max-w-xl"><SwitchField {...args} /></div>
  {/snippet}
</Story>

<!--
  What the switch turns on stays inside the same bordered surface, so it reads
  as part of what the switch controls rather than an unrelated section that
  happened to appear. The revealed content is unmounted while off, not hidden,
  so nothing inside keeps fetching after the switch is dismissed.
-->
<Story name="With revealed content" asChild>
  <div class="max-w-xl">
    <SwitchField
      id="revealed-collect-tax"
      label="Collect tax at this location"
      description="Applies the default rate unless overridden below."
      bind:checked={revealed.on}
    >
      <p class="text-muted-foreground text-sm">Override fields would render here.</p>
    </SwitchField>
  </div>
</Story>

<!--
  Several at once, in the card that already contains them.

  The default variant draws its own bordered surface, which is right for a
  switch standing alone and wrong the moment there are three: a bordered card
  holding three bordered rows is three containers deep, and the reader counts
  boxes rather than reading rows. Compare Stacked bordered below.

  `variant="flush"` drops the surface and `divide-y` on the wrapper does the
  separating: one class, and it cannot leave a rule above the first row or
  below the last, which hand-placed separators can.
-->
<Story name="In a card" asChild>
  <Card class="max-w-2xl">
    <CardHeader>
      <CardTitle>What this location does</CardTitle>
      <CardDescription
        >Each one decides which screens and figures this location gets.</CardDescription
      >
    </CardHeader>
    <CardContent>
      <div class="divide-border divide-y">
        <SwitchField
          variant="flush"
          id="stacked-retail"
          label="Sells to customers"
          description="Takes orders at a register. Turns on sales figures."
          bind:checked={stacked.retail}
        />
        <SwitchField
          variant="flush"
          id="stacked-production"
          label="Produces stock"
          description="Runs recipes and production batches on site."
          bind:checked={stacked.production}
        />
        <SwitchField
          variant="flush"
          id="stacked-storage"
          label="Holds stock"
          description="Keeps inventory, so it can send and receive transfers."
          bind:checked={stacked.storage}
        />
      </div>
    </CardContent>
  </Card>
</Story>

<!--
  The same three in the default variant, kept as the comparison rather than as
  a recommendation: the nesting is the whole argument for `flush`.
-->
<Story name="Stacked bordered" asChild>
  <Card class="max-w-2xl">
    <CardHeader><CardTitle>What this location does</CardTitle></CardHeader>
    <CardContent class="flex flex-col gap-3">
      <SwitchField
        id="bordered-retail"
        label="Sells to customers"
        description="Takes orders at a register."
        bind:checked={bordered.retail}
      />
      <SwitchField
        id="bordered-production"
        label="Produces stock"
        description="Runs recipes and production batches on site."
        bind:checked={bordered.production}
      />
      <SwitchField
        id="bordered-storage"
        label="Holds stock"
        description="Keeps inventory, so it can send and receive transfers."
        bind:checked={bordered.storage}
      />
    </CardContent>
  </Card>
</Story>

<!--
  Flush with revealed content, the one place the two variants differ beyond
  the surface. The default variant rules the revealed block off with a
  `border-t`, which works inside its own box. Flush indents with a `border-l`
  instead: a horizontal rule here would be a third kind of horizontal line
  among the row separators, and nothing would say which of them grouped what.
-->
<Story name="Flush expanding" asChild>
  <Card class="max-w-2xl">
    <CardHeader><CardTitle>Tax</CardTitle></CardHeader>
    <CardContent>
      <div class="divide-border divide-y">
        <SwitchField
          variant="flush"
          id="flush-collect-tax"
          label="Collect tax at this location"
          description="Applies the default rate unless overridden."
          bind:checked={flush.tax}
        >
          <p class="text-muted-foreground text-sm">Override fields would render here.</p>
        </SwitchField>
        <SwitchField
          variant="flush"
          id="flush-inclusive"
          label="Prices include tax"
          description="Shown on the register and on receipts."
          bind:checked={flush.inclusive}
        />
      </div>
    </CardContent>
  </Card>
</Story>
