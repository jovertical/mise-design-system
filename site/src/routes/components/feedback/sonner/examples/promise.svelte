<!-- One toast that follows the work: loading, then success or the error. -->
<script lang="ts">
  import { Button, toast } from '@jovertical/mise-design-system'

  function exportStock() {
    const done = new Promise<number>((resolve) => setTimeout(() => resolve(1204), 1500))

    toast.promise(done, {
      loading: 'Building the stock list…',
      success: (rows) => `${rows} rows exported`,
      error: 'The export failed',
    })
  }
</script>

<Button variant="outline" onclick={exportStock}>Export stock</Button>
