<!--
  A column of facts: label left, value right. A missing value renders an em
  dash, since a blank reads as a bug rather than as "none".
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    FactList,
    FactListItem,
  } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-sm">
  <CardHeader><CardTitle>Location details</CardTitle></CardHeader>
  <CardContent>
    <FactList>
      <FactListItem label="Purpose" value="Retail · Storage" />
      <FactListItem label="Opened" value="1 Jan 2026" />
      <FactListItem label="Approved by" value={null} />
    </FactList>
  </CardContent>
</Card>
