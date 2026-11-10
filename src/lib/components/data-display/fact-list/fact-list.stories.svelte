<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconCalendar from '@tabler/icons-svelte-runes/icons/calendar'
  import IconFlag from '@tabler/icons-svelte-runes/icons/flag'
  import IconId from '@tabler/icons-svelte-runes/icons/id'
  import IconMail from '@tabler/icons-svelte-runes/icons/mail'
  import IconPhone from '@tabler/icons-svelte-runes/icons/phone'
  import IconTag from '@tabler/icons-svelte-runes/icons/tag'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'
  import type { Component } from 'svelte'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Separator from '../../layout/separator/separator.svelte'
  import FactList from './fact-list.svelte'
  import FactListItem from './fact-list-item.svelte'

  const { Story } = defineMeta({
    title: 'Data display/FactList',
    component: FactList,
    tags: ['mise'],
    argTypes: { compact: { control: 'boolean' } },
  })

  type Fact = { icon: Component; label: string; value: string | null }

  const identity: Fact[] = [
    { icon: IconBuildingWarehouse, label: 'Location', value: 'Riverside' },
    { icon: IconTag, label: 'Reason', value: 'Cycle count' },
    { icon: IconUser, label: 'Requested by', value: 'Ana Cruz' },
    { icon: IconCalendar, label: 'Date counted', value: '16 Jul 2026' },
    { icon: IconFlag, label: 'Status', value: null },
  ]

  const supplier: Fact[] = [
    { icon: IconId, label: 'Supplier code', value: 'SUP-1001' },
    { icon: IconTag, label: 'Category', value: 'Dry goods' },
    { icon: IconUser, label: 'Account owner', value: null },
    { icon: IconCalendar, label: 'Onboarded', value: '8 Sep 2026' },
  ]

  const contact: Fact[] = [
    { icon: IconUser, label: 'Contact', value: 'Ben Ortiz' },
    { icon: IconMail, label: 'Email', value: 'ben.ortiz@example.org' },
    { icon: IconPhone, label: 'Phone', value: null },
  ]
</script>

{#snippet address()}
  <span class="block">120 Harbour Road</span>
  <span class="text-muted-foreground block font-normal">Riverside, 4021</span>
{/snippet}

<!--
  A column of facts, `gap-2` apart: thirty of the thirty-five lists the React
  package counted.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-sm">
      <CardHeader><CardTitle>Location details</CardTitle></CardHeader>
      <CardContent>
        <FactList {...args}>
          <FactListItem label="Purpose" value="Retail · Storage" />
          <FactListItem label="Opened" value="1 Jan 2026" />
          <FactListItem label="Phone" value="+1 555 0142" />
        </FactList>
      </CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  `horizontal` owns a full line: label left, value right. `vertical` stacks
  them, for a narrow column, such as three cards across, where a right-aligned
  value would truncate to nothing.
-->
<Story name="Orientations" asChild>
  <Card class="max-w-sm">
    <CardContent>
      <StoryAxis values={['horizontal', 'vertical'] as const} orientation="vertical">
        {#snippet item(orientation)}
          <FactList>
            <FactListItem {orientation} label="Name" value="Cold brew concentrate" />
            <FactListItem {orientation} label="On hand" value="60" />
          </FactList>
        {/snippet}
      </StoryAxis>
    </CardContent>
  </Card>
</Story>

<!-- A missing value renders an em dash: a blank cell reads as a bug, not as "none". -->
<Story name="States" asChild>
  <Card class="max-w-sm">
    <CardContent>
      <FactList>
        <FactListItem label="Location" value="Harbour" />
        <FactListItem label="Approved by" value={null} />
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  An icon for a fact that identifies (a location, a person, a category). Vertical
  only. `square`, the default, for a column of facts under a heading.
-->
<Story name="With icon" asChild>
  <Card class="max-w-xs">
    <CardHeader><CardTitle>Supplier</CardTitle></CardHeader>
    <CardContent>
      <FactList class="gap-4">
        {#each supplier as fact (fact.label)}
          {#snippet icon()}
            <fact.icon />
          {/snippet}
          <FactListItem orientation="vertical" {icon} label={fact.label} value={fact.value} />
        {/each}
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  `multiline` lets a vertical value wrap rather than truncate, for the one field
  worth reading past a line.
-->
<Story name="Long content" asChild>
  <Card class="max-w-xs">
    <CardContent>
      <FactList>
        <FactListItem
          orientation="vertical"
          multiline
          label="Description"
          value="Single origin cold brew, steeped for eighteen hours and kept chilled at the counter."
        />
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  `compact`, `gap-1`, for an aside where the list is a footnote to a preview
  above it rather than the card's content.
-->
<Story name="In an aside" asChild>
  <Card class="max-w-xs">
    <CardContent>
      <FactList compact>
        <FactListItem label="Category" value="Sauces" />
        <FactListItem label="Makes" value="2 L" />
        <FactListItem label="Time" value="45 minutes" />
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  What a thing is, a rule, then what it totals: two lists, not one list with a
  prop for the rule. The grand total is a list of one.
-->
<Story name="Two blocks" asChild>
  <Card class="max-w-sm">
    <CardHeader><CardTitle>Purchase order</CardTitle></CardHeader>
    <CardContent stack="md">
      <FactList>
        <FactListItem label="Subtotal" value="$12,450.00" />
        <FactListItem label="Tax" value="$1,494.00" />
        <FactListItem label="Shipping" value="$350.00" />
      </FactList>
      <Separator />
      <FactList>
        <FactListItem label="Grand total" value="$14,294.00" valueClass="text-base font-semibold" />
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  `valueClass` colours a value without a tone prop on the item. Green and red
  here are a sign, not a status.
-->
<Story name="Totals coloured by sign" asChild>
  <Card class="max-w-sm">
    <CardHeader><CardTitle>Adjustment summary</CardTitle></CardHeader>
    <CardContent stack="md">
      <FactList>
        <FactListItem label="Location" value="Harbour" />
        <FactListItem label="Reason" value="Damage" />
        <FactListItem label="Date" value="16 Jul 2026" />
      </FactList>
      <Separator />
      <FactList>
        <FactListItem label="Total lines" value="2" />
        <FactListItem label="Total added" value="+0" valueClass="text-success" />
        <FactListItem label="Net change" value="-5" valueClass="text-destructive" />
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  A value of two lines, such as an address. The second line is muted and
  `font-normal`, or it reads as a second value; `items-baseline` aligns the
  label with the first line.
-->
<Story name="Two-line value" asChild>
  <Card class="max-w-sm">
    <CardContent>
      <FactList>
        <FactListItem label="Address" value={address} />
        <FactListItem label="Opened" value="2026-01-01" />
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  A record's identifying facts in one strip above the detail that follows.
  `iconShape="circle"`: a strip read across, where round chips keep several
  facts from reading as a form.
-->
<Story name="Identity strip" asChild>
  <Card>
    <CardContent>
      <FactList class="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        {#each identity as fact (fact.label)}
          {#snippet icon()}
            <fact.icon />
          {/snippet}
          <FactListItem
            orientation="vertical"
            {icon}
            iconShape="circle"
            label={fact.label}
            value={fact.value}
          />
        {/each}
      </FactList>
    </CardContent>
  </Card>
</Story>

<!--
  More facts than a strip holds, grouped under headings, one per row.
  `square` chips even below a strip of circles: two shapes doing two jobs at
  two scales. Below about three rows a card is not worth its own heading.
-->
<Story name="Grouped facts" asChild>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    {#each [
      { title: 'Supplier', facts: supplier },
      { title: 'Primary contact', facts: contact },
    ] as group (group.title)}
      <Card>
        <CardHeader><CardTitle>{group.title}</CardTitle></CardHeader>
        <CardContent>
          <FactList class="gap-4">
            {#each group.facts as fact (fact.label)}
              {#snippet icon()}
                <fact.icon />
              {/snippet}
              <FactListItem orientation="vertical" {icon} label={fact.label} value={fact.value} />
            {/each}
          </FactList>
        </CardContent>
      </Card>
    {/each}
  </div>
</Story>
