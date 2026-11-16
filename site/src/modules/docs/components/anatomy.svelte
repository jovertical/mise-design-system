<!--
  The live component on a stage, with a numbered marker and a line to each
  part, found by its data-slot. Hovering or focusing a marker or a legend row
  outlines the part. Redraws on resize and on a theme change. A part not found
  is shown as missing, and the smoke run fails on it.
-->
<script lang="ts" module>
  import type { Example } from '#modules/docs/data/example.js'

  export type AnatomyPart = { slot: string; label: string; part?: string }
  export type AnatomyProps = { example: Example; parts: AnatomyPart[] }
</script>

<script lang="ts">
  import { untrack } from 'svelte'

  import {
    layoutMarkers,
    MARKER_SIZE,
    type Marker,
    relativeBox,
  } from '#modules/docs/utils/anatomy-layout.js'

  import AnatomyLegend from './anatomy-legend.svelte'

  let { example, parts }: AnatomyProps = $props()

  let stage: HTMLDivElement | null = $state(null)
  let markers: Marker[] = $state([])
  let missing: string[] = $state([])
  let active: number | null = $state(null)

  const outlined = $derived(markers.find((marker) => marker.index === active)?.box ?? null)

  function measure() {
    if (!stage) return

    const frame = stage.getBoundingClientRect()
    const elements = parts.map((part) => stage?.querySelector(`[data-slot="${part.slot}"]`) ?? null)

    markers = layoutMarkers(
      relativeBox(frame, frame),
      elements.map((element) =>
        element ? relativeBox(element.getBoundingClientRect(), frame) : null,
      ),
    )

    const notFound = parts.filter((_part, index) => !elements[index]).map((part) => part.slot)

    for (const slot of notFound) console.error(`Anatomy: no [data-slot="${slot}"] in the example`)

    missing = notFound
  }

  $effect(() => {
    if (!stage) return

    // Measuring writes markers and missing; untracked so it never reruns itself.
    untrack(measure)

    const resizes = new ResizeObserver(measure)
    const themes = new MutationObserver(measure)

    resizes.observe(stage)

    themes.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      resizes.disconnect()

      themes.disconnect()
    }
  })
</script>

<figure class="bg-card ring-foreground/5 my-6 overflow-hidden rounded-2xl ring-1">
  <div
    bind:this={stage}
    data-anatomy-stage
    data-anatomy-count={parts.length}
    class="relative flex min-h-64 flex-wrap items-center justify-center gap-4 px-16 py-10"
  >
    <example.component />
    <svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      {#each markers as marker (marker.index)}
        <line
          x1={marker.x + MARKER_SIZE / 2}
          y1={marker.y + MARKER_SIZE / 2}
          x2={marker.lineTo.x}
          y2={marker.lineTo.y}
          class="stroke-primary"
          stroke-width="1"
        />
      {/each}
    </svg>
    {#each markers as marker (marker.index)}
      <button
        type="button"
        data-anatomy-marker
        aria-label="{marker.index + 1}: {parts[marker.index].label}"
        class="bg-primary text-primary-foreground absolute grid place-items-center rounded-full text-[11px] font-semibold"
        style:left="{marker.x}px"
        style:top="{marker.y}px"
        style:width="{MARKER_SIZE}px"
        style:height="{MARKER_SIZE}px"
        onmouseenter={() => (active = marker.index)}
        onmouseleave={() => (active = null)}
        onfocus={() => (active = marker.index)}
        onblur={() => (active = null)}
      >
        {marker.index + 1}
      </button>
    {/each}
    {#if outlined}
      <div
        data-anatomy-outline
        class="ring-primary pointer-events-none absolute rounded-md ring-2 ring-offset-2 ring-offset-transparent"
        style:left="{outlined.x}px"
        style:top="{outlined.y}px"
        style:width="{outlined.width}px"
        style:height="{outlined.height}px"
      ></div>
    {/if}
    {#each missing as slot (slot)}
      <span data-anatomy-missing={slot} class="sr-only">{slot} not found</span>
    {/each}
  </div>
  <AnatomyLegend {parts} {missing} bind:active />
</figure>
