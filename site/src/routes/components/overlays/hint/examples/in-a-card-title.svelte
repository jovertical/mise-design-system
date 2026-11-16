<!-- On a card's heading: CardTitle is a flex row, so the trigger sits on the title's baseline. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Hint,
  } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-lg">
  <CardHeader>
    <CardTitle>
      Stock health by category
      <Hint label="How stock health is calculated">
        Available stock measured against the reorder point set on each category. Categories with no
        reorder point are excluded.
      </Hint>
    </CardTitle>
    <CardDescription>Available stock against recommended inventory levels</CardDescription>
  </CardHeader>
  <CardContent class="text-muted-foreground text-sm">Six categories reporting.</CardContent>
</Card>
