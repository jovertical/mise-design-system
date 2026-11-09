# Recipe: a dashboard page

A day's dashboard for one location: four headline figures, orders by hour, and sales by
location ranked against target. The code is [dashboard-page.svelte](dashboard-page.svelte), a
page component that type-checks against the current mise.

## What it is made of

- `PageLayout` and `PageHeader` ([layout](../components/layout.md)): the page frame, the title,
  the description and an action on the right.
- `StatTile` ([data display](../components/data-display.md)), four of them in a plain grid. One
  figure per tile; `delta` takes a `DeltaBadge`, `visual` a `Sparkline`.
- `Card` with `ChartContainer` and a LayerChart `AreaChart`
  ([data display](../components/data-display.md)) for the trend.
- `Card` with `MetricBar`s, `rank` numbering them, for the ranking.

## Decisions worth copying

- **`StatTile`, not `MetricRow`, for the headline row.** A tile states one figure and qualifies
  it; `MetricRow` is one subject with several figures and a bar under them.
- **The grid is the app's one class.** `grid gap-4 sm:grid-cols-2 lg:grid-cols-4` is layout,
  which is what `class` is for. The tiles bring their own surface; do not wrap them in `Card`.
- **Figures arrive formatted.** `value="$14,527"` with `exactValue="$14,527.40"` on hover; mise
  never formats money.
- **`invert` on a delta where falling is good.** Refunds up 3.1% is bad news, so the refunds
  delta is `invert` and reads as a warning.
- **Chart colours come from the config**: `--chart-1` for the series, read back as
  `--color-orders`. The chart follows the theme and dark mode with no extra work.

## The app shell

The `Sidebar` belongs to the app's layout, not to each page: a layout component renders
`SidebarProvider`, `Sidebar` and an inset where pages like this one go. See `Sidebar` in
[navigation](../components/navigation.md) for its parts.

## Dependencies

The chart imports `layerchart`, `d3-scale` and `d3-shape` directly. mise depends on them, but a
strict package manager (pnpm) only lets the app import what it declares, so add them to the app:
`pnpm add layerchart d3-scale d3-shape`.
