<!-- Panels under a track of triggers; `bind:value` names the open one. -->
<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@jovertical/mise-design-system'
  import IconCalendarClock from '@tabler/icons-svelte-runes/icons/calendar-clock'
  import IconList from '@tabler/icons-svelte-runes/icons/list'

  let tab = $state('schedule')
</script>

<Tabs bind:value={tab} class="w-full max-w-2xl">
  <TabsList>
    <TabsTrigger value="schedule"><IconCalendarClock />Register schedule</TabsTrigger>
    <TabsTrigger value="activity"><IconList />Recent activity</TabsTrigger>
  </TabsList>
  <TabsContent value="schedule" class="text-muted-foreground py-4 text-sm">
    Two registers open for the afternoon shift.
  </TabsContent>
  <TabsContent value="activity" class="text-muted-foreground py-4 text-sm">
    Nothing has moved since the 14:20 count.
  </TabsContent>
</Tabs>
