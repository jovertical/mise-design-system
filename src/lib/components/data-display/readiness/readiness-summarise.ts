/**
 * Origin: the React package 2.23.0 `readiness.tsx` (`ReadinessItem`, `summariseReadiness`)
 * Diverged: the types and the counting in their own module, so a page can ask
 *   the question without importing a component. `action` is a snippet.
 */
import type { Snippet } from 'svelte'

export type ReadinessStatus = 'met' | 'unmet' | 'pending' | 'not-applicable'

export type ReadinessItem = {
  id: string
  label: string
  status: ReadinessStatus
  /** Unmet-but-optional reads differently from unmet-and-required. */
  optional?: boolean
  /** What is wrong. A server has a sentence for this; a form usually does not. */
  detail?: string
  /** Under an unmet row: "Fix this", pointing at wherever it is fixed. */
  action?: Snippet
}

export type ReadinessSummaryData = {
  /** Everything except `not-applicable`, which is dropped rather than greyed. */
  applicable: ReadinessItem[]
  met: number
  total: number
  percent: number
  /** Required and unmet: the reason a gate is closed. */
  blocking: ReadinessItem[]
  /** In flight rather than missing. Neither met nor blocking. */
  pending: ReadinessItem[]
  complete: boolean
}

/**
 * The counting, in one place, so a checklist showing four ticks and a summary
 * claiming three of five cannot happen. Exported because a page sometimes
 * needs the answer without rendering either: whether to enable a button.
 *
 * Optional rows count toward progress and not toward permission, which is
 * what lets a bar sit short of full on something that is nonetheless
 * finishable.
 */
export function summariseReadiness(items: readonly ReadinessItem[]): ReadinessSummaryData {
  const applicable = items.filter((item) => item.status !== 'not-applicable')
  const met = applicable.filter((item) => item.status === 'met').length
  const total = applicable.length
  const blocking = applicable.filter((item) => item.status === 'unmet' && !item.optional)
  const pending = applicable.filter((item) => item.status === 'pending')

  return {
    applicable,
    met,
    total,
    percent: total > 0 ? Math.round((met / total) * 100) : 0,
    blocking,
    pending,
    complete: blocking.length === 0 && pending.length === 0,
  }
}
