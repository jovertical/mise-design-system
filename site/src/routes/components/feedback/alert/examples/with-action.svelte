<!--
  A title for a message that needs a heading and a paragraph, and the button
  the alert asks the reader to press, in AlertAction: a third column, centred.
  Two actions at most, the main one solid; more is a form, not an alert.
-->
<script lang="ts">
  import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
    Button,
  } from '@jovertical/mise-design-system'
  import IconArrowRight from '@tabler/icons-svelte-runes/icons/arrow-right'
  import IconClock from '@tabler/icons-svelte-runes/icons/clock'
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle'
</script>

<div class="grid w-full max-w-3xl gap-3">
  <Alert tone="warning">
    <IconClock />
    <AlertTitle>Waiting for approval</AlertTitle>
    <AlertDescription>
      Price change: minimum $13.00 → $12.00 · <strong>0 of 2</strong> approvals.
    </AlertDescription>
    <AlertAction>
      <Button variant="outline" size="sm">Review<IconArrowRight /></Button>
    </AlertAction>
  </Alert>
  <Alert>
    <IconInfoCircle />
    <AlertTitle>Setup stopped at Registers</AlertTitle>
    <AlertDescription>Pick up where it left off, or discard the draft.</AlertDescription>
    <AlertAction>
      <Button variant="ghost" size="sm">Discard</Button>
      <Button size="sm">Continue setup</Button>
    </AlertAction>
  </Alert>
</div>
