<!-- The docs' layout renders the Toaster once, as an app's does; this only calls toast(). -->
<script lang="ts">
  import { Button, toast } from '@jovertical/mise-design-system'
</script>

<Button onclick={() => toast('Stock count saved')}>Save count</Button>
