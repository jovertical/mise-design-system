<!--
  What a thing is, a rule, then what it totals: two lists, not one list with
  a prop for the rule. `valueClass` sizes or colours a value; green and red
  here are a sign, not a status.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    FactList,
    FactListItem,
    Separator,
  } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-sm">
  <CardHeader><CardTitle>Adjustment summary</CardTitle></CardHeader>
  <CardContent stack="md">
    <FactList>
      <FactListItem label="Location" value="Harbour" />
      <FactListItem label="Reason" value="Damage" />
    </FactList>
    <Separator />
    <FactList>
      <FactListItem label="Added" value="+0" valueClass="text-success" />
      <FactListItem label="Net change" value="-5" valueClass="text-destructive" />
      <FactListItem label="New on hand" value="55" valueClass="text-base font-semibold" />
    </FactList>
  </CardContent>
</Card>
