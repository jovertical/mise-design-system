<!-- Story scaffolding, not a package export: a device's status as a badge. -->
<script lang="ts">
  import Badge from '../../src/lib/components/data-display/badge/badge.svelte'
  import { type Device, STATUS_TONE } from './devices.js'

  let { status }: { status: Device['status'] } = $props()
</script>

<Badge tone={STATUS_TONE[status]}>{status}</Badge>
