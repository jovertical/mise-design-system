<script lang="ts">
  import { TreeLeaf } from '../../src/lib/index.js'

  let { mediaSize }: { mediaSize?: 'md' | 'sm' } = $props()
</script>

{#snippet bottle()}
  <span data-testid="icon">B</span>
{/snippet}

<ul>
  <TreeLeaf icon={bottle} label="All-purpose flour" trailing="250 g" {mediaSize} />
  <TreeLeaf position="last" icon={bottle} label="Butter" />
</ul>
