<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { RAMP_ROLES, SEMANTIC_TOKENS, STEPS } from '../../src/lib/tokens.js'

  /**
   * The six role ramps `:root` carries, and the semantic tokens that read them.
   * Switch the Theme toolbar to watch a preset move both.
   */
  const { Story } = defineMeta({ title: 'Foundations/Palette', tags: ['!autodocs'] })
</script>

<Story name="Ramps" asChild>
  <div class="grid gap-2">
    {#each RAMP_ROLES as role}
      <div class="grid grid-cols-[6rem_repeat(11,minmax(0,1fr))] items-center gap-1">
        <span class="text-muted-foreground text-xs">{role}</span>
        {#each STEPS as step}
          <div
            class="h-10 rounded-md"
            style="background: var(--color-{role}-{step})"
            title="--color-{role}-{step}"
          ></div>
        {/each}
      </div>
    {/each}
  </div>
</Story>

<Story name="Semantic" asChild>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3">
    {#each SEMANTIC_TOKENS as token}
      <div class="bg-card flex items-center gap-3 rounded-xl p-2 ring-1 ring-foreground/5">
        <div
          class="size-8 shrink-0 rounded-md ring-1 ring-foreground/10"
          style="background: var({token})"
        ></div>
        <code class="text-xs">{token}</code>
      </div>
    {/each}
  </div>
</Story>
