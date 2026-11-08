<script module lang="ts">
  import BuildingIcon from '@lucide/svelte/icons/building'
  import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock'
  import ListIcon from '@lucide/svelte/icons/list'
  import MonitorIcon from '@lucide/svelte/icons/monitor'
  import KanbanIcon from '@lucide/svelte/icons/square-kanban'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Tabs from './tabs.svelte'
  import TabsContent from './tabs-content.svelte'
  import TabsList from './tabs-list.svelte'
  import TabsTrigger from './tabs-trigger.svelte'

  const { Story } = defineMeta({ title: 'Navigation/Tabs', component: Tabs, tags: ['shadcn'] })
</script>

<!--
  The control on its own. The track is a wash (`bg-black/5`), not a colour, so it
  darkens whatever it sits on rather than painting a fixed grey that may or may
  not differ from the surface underneath.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Tabs value="table" {...args}>
      <TabsList>
        <TabsTrigger value="table"><ListIcon />Table</TabsTrigger>
        <TabsTrigger value="kanban"><KanbanIcon />Kanban</TabsTrigger>
      </TabsList>
    </Tabs>
  {/snippet}
</Story>
<!--
  A disabled trigger keeps its place in the track rather than disappearing: the
  set of choices does not change, only what can be picked.
-->
<Story name="States" asChild>
  <Tabs value="locations">
    <TabsList>
      <TabsTrigger value="locations">Locations</TabsTrigger>
      <TabsTrigger value="registers">Registers</TabsTrigger>
      <TabsTrigger value="suppliers" disabled>Suppliers</TabsTrigger>
    </TabsList>
  </Tabs>
</Story>

<!-- Panels, which is what the primitive is actually for. -->
<Story name="With content" asChild>
  <Tabs value="schedule" class="max-w-2xl">
    <TabsList>
      <TabsTrigger value="schedule"><CalendarClockIcon />Register schedule</TabsTrigger>
      <TabsTrigger value="activity"><ListIcon />Recent activity</TabsTrigger>
    </TabsList>
    <TabsContent value="schedule" class="text-muted-foreground py-4 text-sm">
      Two registers open for the afternoon shift.
    </TabsContent>
    <TabsContent value="activity" class="text-muted-foreground py-4 text-sm">
      Nothing has moved since the 14:20 count.
    </TabsContent>
  </Tabs>
</Story>

<!--
  The control on the page surface, which is `bg-muted`. A track painted
  `bg-muted` would be the page's own colour; the wash has to be visible here
  without a border.
-->
<Story name="On a page" asChild parameters={{ layout: 'fullscreen' }}>
  <div class="bg-muted min-h-64 p-8">
    <Tabs value="locations">
      <TabsList>
        <TabsTrigger value="locations"><BuildingIcon />Locations</TabsTrigger>
        <TabsTrigger value="registers"><MonitorIcon />Registers</TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</Story>

<!--
  The same control inside a card, where the surface is white. A flat track
  colour cannot be right on both this and the page above; a wash is.
-->
<Story name="In a card" asChild>
  <Card class="max-w-2xl">
    <CardHeader><CardTitle>Riverside</CardTitle></CardHeader>
    <CardContent>
      <Tabs value="summary">
        <TabsList>
          <TabsTrigger value="summary">Stock summary</TabsTrigger>
          <TabsTrigger value="dock">Restock schedule</TabsTrigger>
          <TabsTrigger value="activity">Recent stock activity</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardContent>
  </Card>
</Story>

<!--
  In a card header, beside the title, as a range switch. The shortest labels in
  the system live here.
-->
<Story name="In a card header" asChild>
  <Card class="max-w-2xl">
    <CardHeader>
      <CardTitle>Stock turnover</CardTitle>
      <div class="col-start-2 row-span-2 row-start-1 justify-self-end">
        <Tabs value="30d">
          <TabsList>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
            <TabsTrigger value="12m">12M</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">
      Average stock turns over the selected period.
    </CardContent>
  </Card>
</Story>

<!-- Full width on narrow viewports: `w-full` on the list. -->
<Story name="Full width" asChild>
  <div class="max-w-sm">
    <Tabs value="locations">
      <TabsList class="w-full">
        <TabsTrigger value="locations"><BuildingIcon />Locations</TabsTrigger>
        <TabsTrigger value="registers"><MonitorIcon />Registers</TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</Story>
