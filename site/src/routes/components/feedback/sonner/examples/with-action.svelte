<script lang="ts">
  import { Button, toast } from '@jovertical/mise-design-system'

  function cancelOrder() {
    toast('Order OR-2053 cancelled', {
      description: 'Its two packages go back to stock.',
      action: { label: 'Undo', onClick: () => toast.success('OR-2053 restored') },
    })
  }
</script>

<Button variant="outline" tone="critical" onclick={cancelOrder}>Cancel order</Button>
