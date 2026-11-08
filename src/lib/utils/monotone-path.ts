/**
 * An SVG path through points, smoothed without overshooting: a curve that is
 * monotone wherever the data is, and flat at every peak and trough. It is
 * d3-shape's `curveMonotoneX` (Steffen's method), which is what recharts draws
 * for `type="monotone"`, written out so a sparkline needs no chart library.
 *
 * Points are `[x, y]` with x increasing. Fewer than two draws nothing; two draw
 * a straight line.
 */
export function monotonePath(points: readonly (readonly [number, number])[]): string {
  if (points.length < 2) return ''

  const [[x0, y0], [x1, y1]] = points
  if (points.length === 2) return `M${x0},${y0}L${x1},${y1}`

  const tangents = interiorTangents(points)
  const last = points.length - 1
  tangents[0] = endTangent(points[0], points[1], tangents[1])
  tangents[last] = endTangent(points[last - 1], points[last], tangents[last - 1])

  let path = `M${x0},${y0}`
  for (let index = 0; index < last; index++) {
    path += segment(points[index], points[index + 1], tangents[index], tangents[index + 1])
  }
  return path
}

/** The tangent at every interior point; the two ends are filled in after. */
function interiorTangents(points: readonly (readonly [number, number])[]): number[] {
  const tangents = new Array<number>(points.length).fill(0)
  for (let index = 1; index < points.length - 1; index++) {
    tangents[index] = interiorTangent(points[index - 1], points[index], points[index + 1])
  }
  return tangents
}

/** Steffen's tangent: zero where the slopes change sign, never steeper than either side allows. */
function interiorTangent(
  [x0, y0]: readonly [number, number],
  [x1, y1]: readonly [number, number],
  [x2, y2]: readonly [number, number],
): number {
  const h0 = x1 - x0
  const h1 = x2 - x1
  const s0 = h0 === 0 ? 0 : (y1 - y0) / h0
  const s1 = h1 === 0 ? 0 : (y2 - y1) / h1
  const p = (s0 * h1 + s1 * h0) / (h0 + h1)
  return (Math.sign(s0) + Math.sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p))
}

/** An end's tangent, from its neighbour's: the one-sided version of the same rule. */
function endTangent(
  [x0, y0]: readonly [number, number],
  [x1, y1]: readonly [number, number],
  neighbour: number,
): number {
  const h = x1 - x0
  return h === 0 ? neighbour : (3 * ((y1 - y0) / h) - neighbour) / 2
}

/** One cubic Bézier, its control points a third of the way along each tangent. */
function segment(
  [x0, y0]: readonly [number, number],
  [x1, y1]: readonly [number, number],
  t0: number,
  t1: number,
): string {
  const dx = (x1 - x0) / 3
  return `C${x0 + dx},${y0 + dx * t0},${x1 - dx},${y1 - dx * t1},${x1},${y1}`
}
