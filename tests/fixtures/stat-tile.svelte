<script lang="ts">
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'

  import { StatTile, type StatTileProps } from '../../src/lib/index.js'

  let props: Partial<StatTileProps> & {
    withIcon?: boolean
    withDelta?: boolean
    withAction?: boolean
  } = $props()
</script>

{#snippet icon()}
  <IconPackage />
{/snippet}
{#snippet delta()}
  <span data-testid="delta">+15.7%</span>
{/snippet}
{#snippet action()}
  <a href="#all" data-testid="action">View all</a>
{/snippet}

<StatTile
  label="On hand"
  value="147"
  {...props}
  icon={props.withIcon ? icon : undefined}
  delta={props.withDelta ? delta : undefined}
  action={props.withAction ? action : undefined}
/>
