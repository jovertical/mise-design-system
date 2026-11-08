<script lang="ts">
  let { label = 'probe' }: { label?: string } = $props()
  let count = $state(0)
</script>

<button type="button" onclick={() => count++}>{label}: {count}</button>
