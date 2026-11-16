/**
 * Where an anatomy's numbered markers go: a part left of the stage's centre
 * gets its marker in the left gutter, otherwise the right, level with the
 * part's middle, with a line to the part's near edge. Markers on one side are
 * pushed down so they never overlap. Pure: boxes in, positions out.
 */
export type Box = { x: number; y: number; width: number; height: number }

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

export function layoutMarkers(stage: Box, boxes: (Box | null)[]): Marker[] {
  const placed = boxes.flatMap((box, index) => (box ? [place(stage, box, index)] : []))

  spreadDown(placed.filter((marker) => marker.x === MARKER_GAP))

  spreadDown(placed.filter((marker) => marker.x !== MARKER_GAP))

  return placed
}

function place(stage: Box, box: Box, index: number): Marker {
  const middle = box.y + box.height / 2
  const onLeft = box.x + box.width / 2 < stage.width / 2

  return {
    index,
    box,
    x: onLeft ? MARKER_GAP : stage.width - MARKER_GAP - MARKER_SIZE,
    y: middle - MARKER_SIZE / 2,
    lineTo: { x: onLeft ? box.x : box.x + box.width, y: middle },
  }
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
