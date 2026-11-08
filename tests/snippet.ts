import { createRawSnippet, type Snippet } from 'svelte'

/** A children snippet holding plain text, for rendering a component directly in a test. */
export const text = (value: string): Snippet =>
  createRawSnippet(() => ({ render: () => `<span>${value}</span>` }))
