<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
  import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right'
  import IconDatabase from '@tabler/icons-svelte-runes/icons/database'
  import IconDeviceMobile from '@tabler/icons-svelte-runes/icons/device-mobile'
  import IconMapPin from '@tabler/icons-svelte-runes/icons/map-pin'
  import IconServer from '@tabler/icons-svelte-runes/icons/server'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Button from '../../actions/button/button.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Badge from '../badge/badge.svelte'
  import Item from './item.svelte'
  import ItemActions from './item-actions.svelte'
  import ItemContent from './item-content.svelte'
  import ItemDescription from './item-description.svelte'
  import ItemGroup from './item-group.svelte'
  import ItemMedia from './item-media.svelte'
  import ItemSeparator from './item-separator.svelte'
  import ItemTitle from './item-title.svelte'

  const { Story } = defineMeta({
    title: 'Data display/Item',
    component: Item,
    tags: ['shadcn'],
    args: { size: 'sm', variant: 'default' },
    argTypes: {
      size: { control: 'inline-radio', options: ['md', 'sm', 'flush'] },
      variant: { control: 'inline-radio', options: ['default', 'outline', 'muted'] },
    },
  })

  const SCALING = [
    { name: 'Espresso beans', from: '18g', to: '25.2g' },
    { name: 'Fresh milk', from: '180ml', to: '252ml' },
    { name: 'Condensed milk', from: '30ml', to: '42ml' },
  ]

  const CRASHES = [
    {
      name: 'TypeError',
      detail: 'Fatal · global',
      message: "Cannot read property 'report' of undefined",
      count: 7,
    },
    {
      name: 'UncleanShutdown',
      detail: 'Unclean · session',
      message: 'A foreground session stopped being seen.',
      count: 2,
    },
    {
      name: 'NetworkError',
      detail: 'Domain · sync',
      message: 'Request failed after 3 retries',
      count: 1,
    },
  ]
</script>

<!--
  A **list row**, not a menu row. `DropdownMenuItem` is a command: it lives in
  a `role="menu"`, moves with the arrow keys and closes on select. This carries
  media, a title, a description and its own actions, and `ItemGroup` is a
  `role="list"`. A notification feed or a device list is this.
-->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard>
      <ItemGroup class="w-[28rem]">
        <Item {...args}>
          <ItemMedia variant="icon"><IconServer /></ItemMedia>
          <ItemContent>
            <ItemTitle>Environment ready</ItemTitle>
            <ItemDescription>A new location's environment finished provisioning.</ItemDescription>
          </ItemContent>
          <ItemActions><IconChevronRight class="text-muted-foreground size-4" /></ItemActions>
        </Item>
        <ItemSeparator />
        <Item {...args}>
          <ItemMedia variant="icon"><IconDatabase /></ItemMedia>
          <ItemContent>
            <ItemTitle>Setup complete</ItemTitle>
            <ItemDescription>North depot has finished setup and is now active.</ItemDescription>
          </ItemContent>
          <ItemActions><IconChevronRight class="text-muted-foreground size-4" /></ItemActions>
        </Item>
      </ItemGroup>
    </OnACard>
  {/snippet}
</Story>

<!--
  The three sizes. `sm` is what nearly every call site uses, because `md`'s
  `p-4 gap-4` is a card's padding on something that is a row inside one.
  `flush` drops the horizontal padding for a row whose container supplies it.
-->
<Story name="Sizes" asChild>
  <OnACard>
    <StoryAxis values={['md', 'sm', 'flush'] as const} orientation="vertical">
      {#snippet item(size)}
        <Item {size} variant="outline" class="w-96">
          <ItemMedia variant="icon"><IconServer /></ItemMedia>
          <ItemContent>
            <ItemTitle>Outpost server</ItemTitle>
            <ItemDescription>Reporting normally.</ItemDescription>
          </ItemContent>
        </Item>
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  `ItemMedia variant="icon"` is IconChip's chip, so it takes the chip's `size`,
  `shape` and `tone`. A tone is for a row in a state worth one (a device gone
  quiet), not a way to tell rows apart.
-->
<Story name="Tones" asChild>
  <OnACard>
    <ItemGroup class="w-96">
      <Item size="sm">
        <ItemMedia variant="icon"><IconDeviceMobile /></ItemMedia>
        <ItemContent>
          <ItemTitle>Register 1</ItemTitle>
          <ItemDescription>Synced 2 minutes ago</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item size="sm">
        <ItemMedia variant="icon" tone="warning"><IconAlertTriangle /></ItemMedia>
        <ItemContent>
          <ItemTitle>Register 2</ItemTitle>
          <ItemDescription>Not seen for 3 days</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  </OnACard>
</Story>

<!--
  Rows carrying their own controls, the case a menu cannot serve: a
  `DropdownMenuItem` closes the menu when clicked, so a row with a button inside
  it has nowhere to put the click.
-->
<Story name="With actions" asChild>
  <ItemGroup class="max-w-lg">
    {#each ['North depot', 'Harbour'] as name, index (name)}
      {#if index > 0}
        <ItemSeparator />
      {/if}
      <Item size="sm">
        <ItemMedia variant="icon"><IconDatabase /></ItemMedia>
        <ItemContent>
          <ItemTitle>{name}</ItemTitle>
          <ItemDescription>398 / 500 units</ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="ghost" size="sm">Manage</Button></ItemActions>
      </Item>
    {/each}
  </ItemGroup>
</Story>

<!--
  Inside a card, `flush` lets the card's own padding do the work: the same job
  `CardList` does for a divided list, without the rules.
-->
<Story name="In a card" asChild>
  <Card class="max-w-lg">
    <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
    <CardContent>
      <ItemGroup>
        {#each ['Device paired', 'Sync completed', 'Location created'] as title (title)}
          <Item size="flush">
            <ItemContent><ItemTitle>{title}</ItemTitle></ItemContent>
            <ItemActions><span class="text-muted-foreground text-xs">2m ago</span></ItemActions>
          </Item>
        {/each}
      </ItemGroup>
    </CardContent>
  </Card>
</Story>

<!--
  A ringed group, for a list that shares its card with something else. The
  moment anything else sits in that CardContent, the list needs its own
  boundary or it reads as part of whichever neighbour is closest:
  `overflow-hidden rounded-xl border` on a wrapper, ItemGroup unchanged inside.
-->
<Story name="Compact in a card" asChild>
  <Card class="max-w-lg">
    <CardHeader><CardTitle>Scaling Large from Medium</CardTitle></CardHeader>
    <CardContent class="flex flex-col gap-4">
      <p class="text-muted-foreground text-sm">
        Every ingredient scales by the same multiplier; packaging is swapped, not scaled.
      </p>
      <div class="overflow-hidden rounded-xl border">
        <ItemGroup>
          {#each SCALING as line, index (line.name)}
            {#if index > 0}
              <ItemSeparator />
            {/if}
            <Item size="sm">
              <ItemContent><ItemTitle>{line.name}</ItemTitle></ItemContent>
              <ItemActions>
                <span class="text-muted-foreground text-xs tabular-nums"
                  >{line.from}
                  → {line.to}</span
                >
                <Badge variant="outline">+40.0%</Badge>
              </ItemActions>
            </Item>
          {/each}
        </ItemGroup>
      </div>
    </CardContent>
  </Card>
</Story>

<!--
  One entity, identified: a related record a page points at. A chip, a name
  that may carry one classifying badge, the facts underneath. Size the chip up
  to `md` standing alone, and pass `line-clamp-none` to the description: an
  address is three lines, and the default clamp would drop the country.
-->
<Story name="Identity in a card" asChild>
  <Card class="max-w-sm">
    <CardHeader><CardTitle>Addresses</CardTitle></CardHeader>
    <CardContent>
      <Item size="flush">
        <ItemMedia variant="icon" size="md"><IconMapPin /></ItemMedia>
        <ItemContent>
          <ItemTitle>Head office <Badge>Primary</Badge></ItemTitle>
          <ItemDescription class="line-clamp-none">
            742 Evergreen Terrace<br>Springfield, IL 62704<br>United States
          </ItemDescription>
        </ItemContent>
      </Item>
    </CardContent>
  </Card>
</Story>

<!--
  Bordered rows, each its own box, for records in their own right: anything a
  reader would expand, act on or count individually. A rule between rows says
  "same thing, next one"; a border around each says "separate thing". ItemGroup
  needs `gap-2` here, and only here, or two borders meet as a 2px rule.
-->
<Story name="Bordered rows in a card" asChild>
  <Card class="max-w-lg">
    <CardHeader class="border-b"><CardTitle>Crash groups</CardTitle></CardHeader>
    <CardContent>
      <ItemGroup class="gap-2">
        {#each CRASHES as group (group.name)}
          <Item variant="outline" size="sm">
            <ItemMedia variant="icon"><IconDatabase /></ItemMedia>
            <ItemContent>
              <ItemTitle>{group.name}</ItemTitle>
              <ItemDescription>{group.detail} · {group.message}</ItemDescription>
            </ItemContent>
            <ItemActions class="flex-col items-end gap-1">
              <Badge
                variant={group.count > 1 ? 'solid' : 'outline'}
                tone={group.count > 1 ? 'critical' : 'neutral'}
                class="tabular-nums"
              >
                {group.count}&times;
              </Badge>
              <span class="text-muted-foreground text-xs">2m ago</span>
            </ItemActions>
          </Item>
        {/each}
      </ItemGroup>
    </CardContent>
  </Card>
</Story>

<!--
  A row you can click is a link or a button, never a `div` with an `onclick`:
  `href` renders the row as an `a`, and `child` renders it as a `button`, so the
  whole row is the target and the keyboard reaches it. Both hover on `--muted`.
-->
<Story name="Clickable row" asChild>
  <OnACard>
    <ItemGroup class="w-96">
      <Item size="sm" href="#device">
        <ItemMedia variant="icon"><IconDeviceMobile /></ItemMedia>
        <ItemContent>
          <ItemTitle>Register 1</ItemTitle>
          <ItemDescription>Opens the device's page: a link, because it navigates.</ItemDescription>
        </ItemContent>
        <ItemActions><IconChevronRight class="text-muted-foreground size-4" /></ItemActions>
      </Item>
      <ItemSeparator />
      <Item size="sm">
        {#snippet child({ props })}
          <button type="button" {...props}>
            <ItemMedia variant="icon"><IconServer /></ItemMedia>
            <ItemContent>
              <ItemTitle>Outpost server</ItemTitle>
              <ItemDescription
                >Opens a drawer: a button, because it stays on the page.</ItemDescription
              >
            </ItemContent>
          </button>
        {/snippet}
      </Item>
    </ItemGroup>
  </OnACard>
</Story>
