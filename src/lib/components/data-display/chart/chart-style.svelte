<!--
  Origin: the React package 2.23.0 `chart.tsx` (`ChartStyle`), itself shadcn/ui new-york `chart`
  Svelte: shadcn-svelte `chart`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { ChartConfig } from './chart-utils.js'

  /** The scoped `<style>` that writes a chart's colours for light and dark. */
  export type ChartStyleProps = { id: string; config: ChartConfig }
</script>

<script lang="ts">
  import { THEMES } from './chart-utils.js'

  let { id, config }: ChartStyleProps = $props()

  const colorConfig = $derived(
    config ? Object.entries(config).filter(([, config]) => config.theme || config.color) : null,
  )

  const themeContents = $derived.by(() => {
    if (!colorConfig?.length) return

    const themeContents = []

    for (const [_theme, prefix] of Object.entries(THEMES)) {
      let content = `${prefix} [data-chart=${id}] {\n`

      const color = colorConfig.map(([key, itemConfig]) => {
        const theme = _theme as keyof typeof itemConfig.theme
        const color = itemConfig.theme?.[theme] || itemConfig.color

        return color ? `\t--color-${key}: ${color};` : null
      })

      content += `${color.join('\n')}\n}`

      themeContents.push(content)
    }

    return themeContents.join('\n')
  })
</script>

{#if themeContents}
  {#key id}
    <svelte:element this={'style'}>
      {themeContents}
    </svelte:element>
  {/key}
{/if}
