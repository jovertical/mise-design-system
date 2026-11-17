<!--
  The live component on a stage, with a numbered marker and a line to each
  part, found by its data-slot (or a selector, for a part a dependency
  renders). Hovering or focusing a marker or a legend row outlines the part.
  Redraws on resize, on a theme change, when an open animation ends and when
  the example renders something after mounting (a chart's legend, drawn once
  it has measured its box). A part not found is shown as missing, and the
  smoke run fails on it.

  The stage is `contain: layout paint`, which makes it the containing block of
  a `position: fixed` descendant: an open dialog and its backdrop stay inside
  the stage instead of covering the page. Markers sit above an overlay's z-50.
-->
<script lang="ts" module>
  import type { Example } from '#modules/docs/data/example.js'

  import type { AnatomyPart } from '#modules/docs/utils/anatomy-parts.js'

  export type { AnatomyPart }

  /** `lg` is the taller stage an open overlay needs. */
  export type AnatomyProps = { example: Example; parts: AnatomyPart[]; size?: 'md' | 'lg' }
</script>

<script lang="ts">
  import { untrack } from 'svelte'

  import {
    layoutMarkers,
    MARKER_SIZE,
    type Marker,
    relativeBox,
  } from '#modules/docs/utils/anatomy-layout.js'
  import { partKey, partQuery } from '#modules/docs/utils/anatomy-parts.js'

  import AnatomyLegend from './anatomy-legend.svelte'

  let { example, parts, size = 'md' }: AnatomyProps = $props()

  let stage: HTMLDivElement | null = $state(null)
  let exampleBox: HTMLDivElement | null = $state(null)
  let markers: Marker[] = $state([])
  let missing: string[] = $state([])
  let active: number | null = $state(null)

  const outlined = $derived(markers.find((marker) => marker.index === active)?.box ?? null)

  function measure() {
    if (!stage) return

    const frame = stage.getBoundingClientRect()
    const elements = parts.map((part) => stage?.querySelector(partQuery(part)) ?? null)

    markers = layoutMarkers(
      relativeBox(frame, frame),
      elements.map((element) =>
        element ? relativeBox(element.getBoundingClientRect(), frame) : null,
      ),
      parts.map((part) => part.placement ?? 'side'),
    )

    const notFound = parts.filter((_part, index) => !elements[index]).map(partKey)

    for (const key of notFound) console.error(`Anatomy: nothing matches ${key} in the example`)

    missing = notFound
  }

  $effect(() => {
    if (!stage) return

    // Measuring writes markers and missing; untracked so it never reruns itself.
    untrack(measure)

    const resizes = new ResizeObserver(measure)
    const themes = new MutationObserver(measure)
    const renders = new MutationObserver(measure)

    resizes.observe(stage)

    // Only the example's subtree: the markers live beside it, so drawing them never retriggers this.
    if (exampleBox) renders.observe(exampleBox, { childList: true, subtree: true })

    stage.addEventListener('animationend', measure)

    stage.addEventListener('transitionend', measure)

    themes.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      resizes.disconnect()

      themes.disconnect()

      renders.disconnect()

      stage?.removeEventListener('animationend', measure)

      stage?.removeEventListener('transitionend', measure)
    }
  })
</script>

<figure class="bg-card ring-foreground/5 my-6 overflow-hidden rounded-2xl ring-1">
  <div
    bind:this={stage}
    data-anatomy-stage
    data-anatomy-count={parts.length}
    class={[
      'relative flex flex-wrap items-center justify-center gap-4 overflow-hidden px-16 py-10 [contain:layout_paint]',
      size === 'lg' ? 'min-h-96' : 'min-h-64',
    ]}
  >
    <div bind:this={exampleBox} data-anatomy-example class="contents">
      <example.component />
    </div>
    <svg class="pointer-events-none absolute inset-0 z-[60] size-full" aria-hidden="true">
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
        class="bg-primary text-primary-foreground absolute z-[60] grid place-items-center rounded-full text-[11px] font-semibold"
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
        class="ring-primary pointer-events-none absolute z-[60] rounded-md ring-2 ring-offset-2 ring-offset-transparent"
        style:left="{outlined.x}px"
        style:top="{outlined.y}px"
        style:width="{outlined.width}px"
        style:height="{outlined.height}px"
      ></div>
    {/if}
    {#each missing as key (key)}
      <span data-anatomy-missing={key} class="sr-only">{key} not found</span>
    {/each}
  </div>
  <AnatomyLegend {parts} {missing} bind:active />
</figure>
