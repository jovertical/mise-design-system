<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/lib/index.js'

  let { value = $bindable('schedule') }: { value?: string } = $props()
</script>

<Tabs bind:value>
  <TabsList>
    <TabsTrigger value="schedule">Register schedule</TabsTrigger>
    <TabsTrigger value="activity">Recent activity</TabsTrigger>
    <TabsTrigger value="archive" disabled>Archive</TabsTrigger>
  </TabsList>
  <TabsContent value="schedule">Two registers open for the afternoon shift.</TabsContent>
  <TabsContent value="activity">Nothing has moved since the 14:20 count.</TabsContent>
  <TabsContent value="archive">Archived shifts.</TabsContent>
</Tabs>
<output data-testid="value">{value}</output>
