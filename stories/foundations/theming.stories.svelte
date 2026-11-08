<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  /**
   * Theming level 2 in the browser: semantic tokens overridden on a wrapper,
   * with no tooling. The -soft tints are color-mix() of their ink, so they
   * follow without being touched.
   */
  const { Story } = defineMeta({ title: 'Foundations/Theming', tags: ['!autodocs'] })
</script>

{#snippet sample()}
  <div
    class="bg-card grid w-64 gap-3 rounded-[min(var(--radius-4xl),24px)] p-5 shadow-sm ring-1 ring-foreground/5"
  >
    <p class="font-heading text-base font-medium">Morning shift</p>
    <p class="text-muted-foreground text-sm">12 orders waiting at the Riverside location.</p>
    <span class="bg-primary-soft text-primary w-fit rounded-lg px-2 py-0.5 text-xs font-medium"
      >On track</span
    >
    <span class="bg-primary text-primary-foreground w-fit rounded-2xl px-4 py-2 text-sm font-medium"
      >Open orders</span
    >
  </div>
{/snippet}

<Story name="CSS override" asChild>
  <div class="flex flex-wrap gap-6">
    {@render sample()}
    <div style="--primary: oklch(0.6 0.15 160); --radius: 0.25rem;">
      {@render sample()}
    </div>
  </div>
</Story>
