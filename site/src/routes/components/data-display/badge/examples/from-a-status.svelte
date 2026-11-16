<!--
  How a domain status reaches a badge: a Record<Status, Tone> beside the type.
  The treatment stays at the call site; the map only answers "what state is
  this".
-->
<script lang="ts">
  import { Badge, type Tone } from '@jovertical/mise-design-system'

  type OrderStatus = 'received' | 'ready' | 'in fulfilment' | 'completed' | 'cancelled'

  const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
    received: 'neutral',
    ready: 'info',
    'in fulfilment': 'warning',
    completed: 'success',
    cancelled: 'critical',
  }

  const STATUSES = Object.keys(ORDER_STATUS_TONE) as OrderStatus[]
</script>

<div class="flex flex-wrap items-center gap-2">
  {#each STATUSES as status (status)}
    <Badge tone={ORDER_STATUS_TONE[status]} class="capitalize">{status}</Badge>
  {/each}
</div>
