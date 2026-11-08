<script module lang="ts">
  import MilkIcon from '@lucide/svelte/icons/milk'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import TreeLeaf from './tree-leaf.svelte'

  const { Story } = defineMeta({
    title: 'Data display/TreeLeaf',
    component: TreeLeaf,
    tags: ['mise'],
  })

  const INGREDIENTS = [
    { id: 'flour', name: 'All-purpose flour', qty: '250 g' },
    { id: 'sugar', name: 'Brown sugar', qty: '80 g' },
    { id: 'butter', name: 'Butter', qty: '120 g' },
  ]
</script>

{#snippet bottle()}
  <MilkIcon />
{/snippet}
{#snippet qty(value: string)}
  <span class="text-muted-foreground text-xs">{value}</span>
{/snippet}

<!--
  A recipe's ingredient list: one level deep, a `<ul>` of leaves. `position="last"`
  on the final row shortens its stem to half height.
-->
<Story name="Playground" asChild>
  <OnACard>
    <ul class="w-72">
      {#each INGREDIENTS as ingredient, index (ingredient.id)}
        {#snippet amount()}
          {@render qty(ingredient.qty)}
        {/snippet}
        <TreeLeaf
          position={index === INGREDIENTS.length - 1 ? 'last' : 'middle'}
          icon={bottle}
          label={ingredient.name}
          trailing={amount}
        />
      {/each}
    </ul>
  </OnACard>
</Story>
