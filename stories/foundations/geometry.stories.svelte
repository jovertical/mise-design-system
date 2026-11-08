<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { geometryRules, radiusScale } from '../../src/lib/tokens.js'

  const { Story } = defineMeta({ title: 'Foundations/Geometry', tags: ['!autodocs'] })
</script>

<Story name="Radii" asChild>
  <div class="flex flex-wrap gap-4">
    {#each Object.keys(radiusScale) as token}
      <div class="grid justify-items-center gap-2">
        <div
          class="bg-card size-20 ring-1 ring-foreground/10"
          style="border-radius: var({token})"
        ></div>
        <code class="text-xs">{token}</code>
      </div>
    {/each}
  </div>
</Story>

<Story name="Control rules" asChild>
  <table class="bg-card w-fit rounded-xl text-sm ring-1 ring-foreground/5">
    <tbody>
      {#each Object.entries(geometryRules) as [element, rule]}
        <tr class="border-b last:border-b-0">
          <td class="px-3 py-2">{element}</td>
          <td class="px-3 py-2"><code class="text-xs">{rule}</code></td>
        </tr>
      {/each}
    </tbody>
  </table>
</Story>
