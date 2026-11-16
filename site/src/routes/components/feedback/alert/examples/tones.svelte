<!-- Five tones, as every status in mise is named; `neutral` states something without colouring it. -->
<script lang="ts">
  import { Alert, AlertDescription } from '@jovertical/mise-design-system'
  import IconAlertOctagon from '@tabler/icons-svelte-runes/icons/alert-octagon'
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
  import IconCircleCheck from '@tabler/icons-svelte-runes/icons/circle-check'
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle'
  import IconTerminal from '@tabler/icons-svelte-runes/icons/terminal'
</script>

<div class="grid w-full max-w-3xl gap-3">
  <Alert tone="info">
    <IconInfoCircle />
    <AlertDescription
      >A transfer writes two ledger rows; total stock is unchanged.</AlertDescription
    >
  </Alert>
  <Alert tone="success">
    <IconCircleCheck />
    <AlertDescription>Location created. Registers can be paired to it now.</AlertDescription>
  </Alert>
  <Alert tone="warning">
    <IconAlertTriangle />
    <AlertDescription>Riverside is <strong>low on crates</strong>.</AlertDescription>
  </Alert>
  <Alert tone="critical">
    <IconAlertOctagon />
    <AlertDescription>Three registers could not be set up. Nothing was charged.</AlertDescription>
  </Alert>
  <Alert>
    <IconTerminal />
    <AlertDescription>The neutral tone states something without colouring it.</AlertDescription>
  </Alert>
</div>
