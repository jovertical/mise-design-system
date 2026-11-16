<!--
  Several at once, in the card that already holds them: `variant="flush"`
  drops each surface, and divide-y on the wrapper rules them apart. Three
  bordered rows in a bordered card is three containers deep.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    SwitchField,
  } from '@jovertical/mise-design-system'

  let roles = $state({ retail: true, production: false, storage: true })
</script>

<Card class="w-full max-w-2xl">
  <CardHeader>
    <CardTitle>What this location does</CardTitle>
    <CardDescription
      >Each one decides which screens and figures this location gets.</CardDescription
    >
  </CardHeader>
  <CardContent>
    <div class="divide-border divide-y">
      <SwitchField
        variant="flush"
        id="role-retail"
        label="Sells to customers"
        description="Takes orders at a register. Turns on sales figures."
        bind:checked={roles.retail}
      />
      <SwitchField
        variant="flush"
        id="role-production"
        label="Produces stock"
        description="Runs recipes and production batches on site."
        bind:checked={roles.production}
      />
      <SwitchField
        variant="flush"
        id="role-storage"
        label="Holds stock"
        description="Keeps inventory, so it can send and receive transfers."
        bind:checked={roles.storage}
      />
    </div>
  </CardContent>
</Card>
