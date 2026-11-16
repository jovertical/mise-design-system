<!-- A disabled trigger keeps its place in the track: the set of choices does not change, only what can be picked. -->
<script lang="ts">
  import { Tabs, TabsList, TabsTrigger } from '@jovertical/mise-design-system'

  let tab = $state('locations')
</script>

<Tabs bind:value={tab}>
  <TabsList>
    <TabsTrigger value="locations">Locations</TabsTrigger>
    <TabsTrigger value="registers">Registers</TabsTrigger>
    <TabsTrigger value="suppliers" disabled>Suppliers</TabsTrigger>
  </TabsList>
</Tabs>
