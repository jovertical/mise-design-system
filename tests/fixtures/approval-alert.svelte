<script lang="ts">
  import type { AlertVariant, Tone } from '../../src/lib/index.js'
  import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from '../../src/lib/index.js'

  let {
    variant,
    tone,
    withAction = true,
  }: { variant?: AlertVariant; tone?: Tone; withAction?: boolean } = $props()
</script>

<Alert {variant} {tone}>
  <AlertTitle>Waiting for approval</AlertTitle>
  <AlertDescription>Price change · <strong>0 of 2</strong> approvals.</AlertDescription>
  {#if withAction}
    <AlertAction><Button variant="outline" size="sm">Review</Button></AlertAction>
  {/if}
</Alert>
