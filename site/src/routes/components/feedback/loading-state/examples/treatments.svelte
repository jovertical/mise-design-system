<!--
  Which loading treatment, and when: a Skeleton where the shape is known, a
  Spinner inside the control that is busy, a captioned Spinner for an inline
  line, and LoadingState only where the shape of what is coming is unknown.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    LoadingState,
    Skeleton,
    Spinner,
  } from '@jovertical/mise-design-system'
</script>

<div class="grid w-full gap-4 md:grid-cols-2">
  <Card>
    <CardHeader><CardTitle>Known shape: Skeleton</CardTitle></CardHeader>
    <CardContent class="space-y-2">
      <Skeleton class="h-4 w-2/3" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-1/2" />
    </CardContent>
  </Card>
  <Card>
    <CardHeader><CardTitle>A busy control</CardTitle></CardHeader>
    <CardContent class="flex flex-col items-start gap-3">
      <Button loading>Saving count</Button>
      <Spinner>Loading locations…</Spinner>
    </CardContent>
  </Card>
  <Card class="md:col-span-2">
    <CardHeader><CardTitle>Unknown shape: LoadingState</CardTitle></CardHeader>
    <CardContent><LoadingState title="Reading movements" /></CardContent>
  </Card>
</div>
