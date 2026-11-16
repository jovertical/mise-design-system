<script lang="ts">
  import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
    Button,
  } from '@jovertical/mise-design-system'
  import IconClock from '@tabler/icons-svelte-runes/icons/clock'
</script>

<Alert tone="warning" class="w-[34rem]">
  <IconClock />
  <AlertTitle>Waiting for approval</AlertTitle>
  <AlertDescription>Price change · <strong>0 of 2</strong> approvals.</AlertDescription>
  <AlertAction><Button variant="outline" size="sm">Review</Button></AlertAction>
</Alert>
