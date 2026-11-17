<!-- The five series colours, `--chart-1` to `--chart-5`, which a config points at. -->
<div class="flex flex-wrap gap-4">
  {#each [1, 2, 3, 4, 5] as index (index)}
    <div class="flex items-center gap-2 text-sm">
      <span
        class="size-6 rounded-md"
        style:background="var(--chart-{index})"
        aria-hidden="true"
      ></span>
      --chart-{index}
    </div>
  {/each}
</div>
