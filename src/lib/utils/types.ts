/**
 * Prop helpers for wrapping elements and bits-ui primitives.
 *
 * From shadcn-svelte's `utils.ts` (MIT; see LICENSES/shadcn-svelte.txt).
 */

/** Adds a bindable `ref` to an element's props. */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null }

/** bits-ui's `child` snippet, removed where a wrapper renders its own element. */
// biome-ignore lint/suspicious/noExplicitAny: matches any snippet signature
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T

// biome-ignore lint/suspicious/noExplicitAny: matches any snippet signature
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T

export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>
