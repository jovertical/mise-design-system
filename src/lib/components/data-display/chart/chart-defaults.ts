/**
 * Origin: the React package 2.23.0 `chart-defaults.ts`
 * Diverged: LayerChart's props for recharts'. `chartAxis` is gone: the tick
 *   lines and axis line it removed are removed by `ChartContainer`'s classes.
 *   `chartGrid` keeps the horizontal lines only, as LayerChart's `x` and `y`
 *   switches. The comparison series is a class, since LayerChart takes the
 *   dash as CSS.
 */

/** Horizontal grid lines only: a vertical line per tick competes with the marks. */
export const chartGrid = { x: false, y: true } as const

/** A light wash under an area, so the line stays the thing read. */
export const chartAreaFillOpacity = 0.15

/** The weight of a series line. */
export const chartLineStrokeWidth = 3

/**
 * A comparison series (last period, a target): muted and dashed, so it reads
 * as context behind the series that matters.
 */
export const chartComparisonSeriesClass = 'stroke-muted-foreground [stroke-dasharray:6_4]'
