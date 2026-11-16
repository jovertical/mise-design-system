<script lang="ts">
  import { Button, toast } from '@jovertical/mise-design-system'
</script>

<Button variant="outline" onclick={() => toast.success('Order OR-2041 is ready')}>Success</Button>
<Button variant="outline" onclick={() => toast.info('Van 12 is 10 minutes out')}>Info</Button>
<Button variant="outline" onclick={() => toast.warning('Riverside is low on crates')}>
  Warning
</Button>
<Button variant="outline" onclick={() => toast.error('The count could not be saved')}>
  Error
</Button>
