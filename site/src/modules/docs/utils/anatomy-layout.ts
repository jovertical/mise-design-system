/**
 * Where an anatomy's numbered markers go. By default (`side`) a part left of
 * the stage's centre gets its marker in the left gutter, otherwise the right,
 * level with the part's middle, with a line to the part's near edge; `left`
 * or `right` picks the gutter, for parts whose centres all sit on one side. A part
 * that sits in a row beside others takes `top` or `bottom` instead, so its
 * line drops straight onto it rather than crossing its neighbours. Markers
 * sharing a gutter are pushed apart so they never overlap. Pure: boxes in,
 * positions out.
 */
export type Box = { x: number; y: number; width: number; height: number }
export type Placement = 'side' | 'left' | 'right' | 'top' | 'bottom'

export type Marker = {
  index: number
  x: number
  y: number
  lineTo: { x: number; y: number }
  box: Box
}

export const MARKER_SIZE = 20
export const MARKER_GAP = 6

export function relativeBox(rect: Box, stage: Box): Box {
  return { x: rect.x - stage.x, y: rect.y - stage.y, width: rect.width, height: rect.height }
}

export function layoutMarkers(
  stage: Box,
  boxes: (Box | null)[],
  placements: Placement[] = [],
): Marker[] {
  const gutters = new Map<string, Marker[]>()

  const placed = boxes.flatMap((box, index) => {
    if (!box) return []

    const placement = placements[index] ?? 'side'
    const vertical = placement === 'top' || placement === 'bottom'

    const marker = vertical
      ? across(stage, box, index, placement)
      : beside(stage, box, index, placement)

    const gutter = vertical ? placement : `side-${marker.x}`

    gutters.set(gutter, [...(gutters.get(gutter) ?? []), marker])

    return [marker]
  })

  for (const [gutter, markers] of gutters) {
    if (gutter.startsWith('side')) spreadDown(markers)
    else spreadRight(markers)
  }

  return placed
}

function across(stage: Box, box: Box, index: number, placement: 'top' | 'bottom'): Marker {
  const centre = box.x + box.width / 2
  const onTop = placement === 'top'

  return {
    index,
    box,
    x: centre - MARKER_SIZE / 2,
    y: onTop ? MARKER_GAP : stage.height - MARKER_GAP - MARKER_SIZE,
    lineTo: { x: centre, y: onTop ? box.y : box.y + box.height },
  }
}

function beside(stage: Box, box: Box, index: number, placement: Placement): Marker {
  const middle = box.y + box.height / 2

  const onLeft =
    placement === 'left' || (placement === 'side' && box.x + box.width / 2 < stage.width / 2)

  return {
    index,
    box,
    x: onLeft ? MARKER_GAP : stage.width - MARKER_GAP - MARKER_SIZE,
    y: middle - MARKER_SIZE / 2,
    lineTo: { x: onLeft ? box.x : box.x + box.width, y: middle },
  }
}

function spreadRight(row: Marker[]) {
  const byPosition = row.toSorted((first, second) => first.x - second.x)

  byPosition.forEach((marker, position) => {
    const before = byPosition[position - 1]

    if (before && marker.x < before.x + MARKER_SIZE + MARKER_GAP) {
      marker.x = before.x + MARKER_SIZE + MARKER_GAP
    }
  })
}

function spreadDown(side: Marker[]) {
  const byHeight = side.toSorted((first, second) => first.y - second.y)

  byHeight.forEach((marker, position) => {
    const above = byHeight[position - 1]

    if (above && marker.y < above.y + MARKER_SIZE + MARKER_GAP) {
      marker.y = above.y + MARKER_SIZE + MARKER_GAP
    }
  })
}
