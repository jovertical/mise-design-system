<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@jovertical/mise-design-system'
</script>

<Tabs value="schedule" class="w-96">
  <TabsList>
    <TabsTrigger value="schedule">Register schedule</TabsTrigger>
    <TabsTrigger value="activity">Recent activity</TabsTrigger>
  </TabsList>
  <TabsContent value="schedule" class="text-muted-foreground py-4 text-sm">
    Two registers open for the afternoon shift.
  </TabsContent>
</Tabs>
