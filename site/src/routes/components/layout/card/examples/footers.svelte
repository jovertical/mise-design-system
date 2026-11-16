<!--
  `divided` draws the rule above a footer. `variant="muted"` is a recessed
  band for a footer that reports a count or a status rather than holding
  actions.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@jovertical/mise-design-system'
</script>

<div class="grid w-full max-w-3xl gap-4 md:grid-cols-2">
  <Card>
    <CardHeader>
      <CardTitle>Close location</CardTitle>
      <CardDescription>This cannot be undone once stock has been moved.</CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm"
      >Riverside holds 398 units across 22 items.</CardContent
    >
    <CardFooter divided class="justify-end">
      <Button variant="outline" size="sm">Cancel</Button>
    </CardFooter>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Paired registers</CardTitle>
      <CardDescription>Registers checked in at this location.</CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm"
      >3 reporting, last sync 2 minutes ago.</CardContent
    >
    <CardFooter variant="muted" divided>7 registers total</CardFooter>
  </Card>
</div>
