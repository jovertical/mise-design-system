<!-- The radius scale, every step a square cornered by its own variable. -->
<script lang="ts" module>
  export type RadiusScaleProps = { steps: string[] }
</script>

<script lang="ts">
  let { steps }: RadiusScaleProps = $props()
</script>

<div class="not-prose my-6 flex flex-wrap gap-4">
  {#each steps as step (step)}
    <div class="flex flex-col items-center gap-1.5">
      <div
        data-radius={step}
        class="bg-primary/15 ring-primary/40 size-16 ring-1"
        style:border-radius="var({step})"
      ></div>
      <code class="text-muted-foreground text-xs">{step}</code>
    </div>
  {/each}
</div>
