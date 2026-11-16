<!--
  The common shape: header, title, description, content. Padding is the
  --card-spacing variable, read by the header, content and footer, so a
  full-bleed child can cancel it.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-lg">
  <CardHeader>
    <CardTitle>Stock by location</CardTitle>
    <CardDescription>Capacity and low-stock risk by location.</CardDescription>
  </CardHeader>
  <CardContent class="text-muted-foreground text-sm">
    Four locations reporting, 1,378 units on hand.
  </CardContent>
</Card>
