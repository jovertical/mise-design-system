/**
 * The traits a component page may carry in its frontmatter, and the overview's
 * filters. A fixed list, so the filters never split one idea into two spellings;
 * a new trait is a line here and nowhere else. The page test enforces it.
 */
export const TRAITS = [
  /** The page documents keys beyond Tab and Enter. */
  'keyboard',
  /** Opens above the page: a dialog, a popover, a menu. */
  'overlay',
  /** Holds a value a form submits. */
  'form control',
  /** Something in it moves by dragging. */
  'draggable',
  /** Built to page, sort or filter on the server. */
  'server data',
] as const

export type Trait = (typeof TRAITS)[number]
