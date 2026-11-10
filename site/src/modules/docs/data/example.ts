import type { Component } from 'svelte'

/** One file in a page's examples/ folder: the component, its source, and the source highlighted. */
export type Example = { component: Component; source: string; html: string }
