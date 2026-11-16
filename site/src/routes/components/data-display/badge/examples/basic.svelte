<!-- `soft` is the default answer for a status: a state something is in. -->
<script lang="ts">
  import { Badge } from '@jovertical/mise-design-system'
</script>

<div class="flex flex-wrap items-center gap-2">
  <Badge>Draft</Badge>
  <Badge tone="info">Scheduled</Badge>
  <Badge tone="success">Active</Badge>
  <Badge tone="warning">On hold</Badge>
  <Badge tone="critical">Cancelled</Badge>
</div>
