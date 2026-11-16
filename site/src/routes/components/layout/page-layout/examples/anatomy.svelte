<!-- For the anatomy. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    PageHeader,
    PageLayout,
  } from '@jovertical/mise-design-system'
</script>

<div class="bg-muted w-[40rem] rounded-xl border">
  <PageLayout>
    <PageHeader title="Riverside" description="North district · 22 items" />
    <Card>
      <CardHeader><CardTitle>Stock</CardTitle></CardHeader>
      <CardContent class="text-muted-foreground text-sm">398 units on hand.</CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>Registers</CardTitle></CardHeader>
      <CardContent class="text-muted-foreground text-sm">3 reporting.</CardContent>
    </Card>
  </PageLayout>
</div>
