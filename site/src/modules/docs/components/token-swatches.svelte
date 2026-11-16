<!--
  One swatch per token, painted from the variable itself, so it shows the
  theme in force (and the other scheme after the toggle).
-->
<script lang="ts" module>
  export type TokenSwatchesProps = { tokens: readonly string[] }
</script>

<script lang="ts">
  let { tokens }: TokenSwatchesProps = $props()
</script>

<div class="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
  {#each tokens as token (token)}
    <div class="flex flex-col gap-1.5">
      <div
        data-token={token}
        class="ring-foreground/10 h-12 rounded-lg ring-1"
        style:background="var({token})"
      ></div>
      <code class="text-muted-foreground text-xs">{token}</code>
    </div>
  {/each}
</div>
