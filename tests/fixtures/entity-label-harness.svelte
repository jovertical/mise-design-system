<script lang="ts">
  import { Avatar, AvatarFallback, EntityLabel, type Tone } from '../../src/lib/index.js'

  let { mode = 'icon', iconTone }: { mode?: 'icon' | 'media' | 'both'; iconTone?: Tone } = $props()
</script>

{#snippet glyph()}
  <span data-testid="glyph">G</span>
{/snippet}
{#snippet avatar()}
  <Avatar><AvatarFallback>NC</AvatarFallback></Avatar>
{/snippet}

<EntityLabel
  title="cycle-count-sheet.pdf"
  description="212 KB"
  icon={mode === 'media' ? undefined : glyph}
  media={mode === 'icon' ? undefined : avatar}
  {iconTone}
/>
