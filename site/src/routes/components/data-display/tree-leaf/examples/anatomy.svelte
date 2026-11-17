<!-- For the anatomy. -->
<script lang="ts">
  import { TreeLeaf } from '@jovertical/mise-design-system'
  import IconMilk from '@tabler/icons-svelte-runes/icons/milk'

  const INGREDIENTS = [
    { id: 'flour', name: 'All-purpose flour', quantity: '250 g' },
    { id: 'sugar', name: 'Brown sugar', quantity: '80 g' },
    { id: 'butter', name: 'Butter', quantity: '120 g' },
  ]
</script>

{#snippet bottle()}
  <IconMilk />
{/snippet}

<div class="w-72">
  <ul>
    {#each INGREDIENTS as ingredient, index (ingredient.id)}
      {#snippet amount()}
        <span class="text-muted-foreground text-xs">{ingredient.quantity}</span>
      {/snippet}
      <TreeLeaf
        position={index === INGREDIENTS.length - 1 ? 'last' : 'middle'}
        icon={bottle}
        label={ingredient.name}
        trailing={amount}
      />
    {/each}
  </ul>
</div>
