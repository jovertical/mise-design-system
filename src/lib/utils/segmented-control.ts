// Copied from the React package 2.23.0 src/components/segmented-control.ts.
// It is a class module with no component, so it lives in utils/ (round 2 plan, R2-1).
// Diverged: the item is `flex-auto` rather than `flex-1`. With a zero basis, a
// `w-fit` track shares its width out equally, so a longer label ("Custom" beside
// "2x") got less than its text and overflowed its pill. `flex-auto` starts each
// item from its own width; a `w-full` track still stretches them.
/**
 * Origin: the React package
 */

/**
 * The segmented control, written once.
 *
 * A row of mutually-exclusive options where the chosen one is a pill lifted off
 * a washed track: the reference's `30D 90D 12M` range picker, a chart's
 * Revenue/Transactions switch, a table's table/grid toggle. Not to be confused
 * with `SegmentedBar`, which is a chart — this is the control, that is the data.
 *
 * It lives in its own module because three components had already drawn it
 * three different ways. `TabsList` was `bg-black/5` at `rounded-full` with a
 * `bg-background` pill; `DataTableViewToggle` hand-wrote `bg-input/50` at
 * `rounded-2xl` with a `bg-card` pill on its call site; the chart headers never
 * got the treatment at all and were still stock shadcn's outlined
 * `bg-accent`. Three approximations of one control is what `docs/theme-fixes.md`
 * §9 predicted when it said the family should end up on one scale.
 *
 * `Tabs` supplies the values because it is the one that was argued. See §9 for
 * the wash, and §20 for why the others follow it.
 */

/**
 * The track the pill slides in.
 *
 * A wash, not a colour. `SidebarInset` paints every routed page `bg-muted`, so
 * a `bg-muted` track was the page's own colour and vanished into it. Darkening
 * whatever is underneath reads on the muted page and on a white card without
 * the control having to know which one it is sitting on — and a flat token
 * cannot be correct on both, because the two surfaces are 14 steps apart.
 */
export const segmentedTrack =
  'text-muted-foreground inline-flex h-8 w-fit items-center justify-center rounded-full bg-black/5 p-1 dark:bg-white/5'

/**
 * One option inside the track.
 *
 * Both Radix state attributes are spelled out. Tabs marks its chosen trigger
 * `data-[state=active]` and ToggleGroup marks its pressed item
 * `data-[state=on]`, so a single class string has to answer to both — and it
 * has to be written literally, because Tailwind scans source text and cannot
 * see a selector assembled at runtime.
 *
 * The active fill is `bg-background` rather than `bg-card`, and steps to
 * `bg-card` in dark. In light the two are the same white; in dark `bg-background`
 * is the page colour, which would make the pill disappear the way the track
 * used to.
 */
export const segmentedItem =
  "text-foreground/60 hover:text-foreground hover:bg-transparent dark:text-muted-foreground dark:hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm dark:data-[state=on]:bg-card dark:data-[state=on]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex h-full flex-auto items-center justify-center gap-1.5 rounded-full border border-transparent px-3 py-0.5 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
