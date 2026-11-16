<!-- Over metric bars: a sales-mix card waiting on a setup step. -->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    LockedOverlay,
    MetricBar,
  } from '@jovertical/mise-design-system'
</script>

{#snippet finishSetup()}
  <Button size="sm">Finish setup</Button>
{/snippet}

<Card class="w-full max-w-md">
  <CardHeader class="border-b"><CardTitle>Sales mix</CardTitle></CardHeader>
  <CardContent>
    <LockedOverlay
      title="Sales by channel"
      message="Break sales down by channel once registers report."
      action={finishSetup}
    >
      <div class="flex flex-col gap-3 py-2">
        <MetricBar label="Counter" percent={54} value="54%" />
        <MetricBar label="Online" percent={31} value="31%" />
        <MetricBar label="Wholesale" percent={15} value="15%" />
      </div>
    </LockedOverlay>
  </CardContent>
</Card>
