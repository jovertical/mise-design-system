/**
 * Origin: the React package 2.23.0 `task-checklist.tsx` and `checklist-card.tsx` (their item types)
 * Diverged: the two components' row types side by side, sharing one state set
 *   (round 8 plan, R8-4). React's `ReactNode` fields are snippets.
 */
import type { Snippet } from 'svelte'

/**
 * `skipped` is its own state rather than a flavour of `completed`. A step a
 * location has no use for is finished with, but it was not *done*: folding the
 * two together would claim work that never happened.
 */
export type ChecklistTaskState = 'completed' | 'skipped' | 'pending'

export type ChecklistTask = {
  /**
   * Stable, and the value `expandedId` matches on; unique across every group,
   * since it can live in a URL fragment.
   */
  id: string
  label: string
  /** Shown when the row is open: what the step is and why it is worth doing. */
  description?: string
  /** The same kind of fact as `description`, read beside the title in a `Hint`. */
  hint?: Snippet
  state: ChecklistTaskState
  /**
   * At the end of the row, beside the disclosure rather than inside it (a
   * button in a button is invalid): "Add a category".
   */
  actions?: Snippet
  /** Revealed on open: a screenshot or a short clip of the step. */
  media?: Snippet
  /** Revealed on open: the way to the documentation. */
  learnMore?: Snippet
}

export type ChecklistGroup = {
  /** Stable across renders; the each-block key and nothing else. */
  key: string
  label: string
  /** 0–100, clamped. The server's answer, not counted from `tasks`. */
  percent: number
  tasks: ChecklistTask[]
}

export type ChecklistCardItem = {
  id: string
  label: string
  done: boolean
  /** At the end of the row: "Start", pointing at wherever the step is done. */
  action?: Snippet
}

/** Prefixes a row's accessible name, so the states differ without the icon or its colour. */
export const CHECKLIST_STATE_LABEL: Record<ChecklistTaskState, string> = {
  completed: 'Completed:',
  skipped: 'Skipped:',
  pending: 'Not started:',
}
