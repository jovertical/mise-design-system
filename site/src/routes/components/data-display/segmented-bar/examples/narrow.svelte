<!--
  A share too narrow to hold its percentage drops the text rather than shrinking
  or spilling it; the caption still names it. Nothing counted yet draws an empty
  track.
-->
<script lang="ts">
  import { Card, CardContent, SegmentedBar } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-3xl">
  <CardContent stack="lg">
    <SegmentedBar
      segments={[
        { label: 'Active', value: 240, tone: 'primary' },
        { label: 'Suspended', value: 9, tone: 'warning' },
        { label: 'Recovery pending', value: 3, tone: 'critical' },
        { label: 'Revoked', value: 2, tone: 'neutral' },
      ]}
    />
    <SegmentedBar segments={[{ label: 'Adequate', value: 0 }]} />
  </CardContent>
</Card>
