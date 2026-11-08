<script lang="ts">
  import StoreIcon from '@lucide/svelte/icons/store'

  import { Button, EmptyState, LoadingState } from '../../src/lib/index.js'

  let {
    kind,
    title,
    description,
    withActions = false,
  }: {
    kind: 'empty' | 'loading'
    title?: string
    description?: string
    withActions?: boolean
  } = $props()
</script>

{#snippet icon()}
  <StoreIcon />
{/snippet}
{#snippet actions()}
  <Button>Add location</Button>
{/snippet}

{#if kind === 'empty'}
  <EmptyState {icon} {title} {description} actions={withActions ? actions : undefined} />
{:else}
  <LoadingState {title} {description} actions={withActions ? actions : undefined} />
{/if}
