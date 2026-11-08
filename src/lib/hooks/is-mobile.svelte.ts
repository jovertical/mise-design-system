import { MediaQuery } from 'svelte/reactivity'

/**
 * Below this viewport width, in pixels, a layout treats the screen as a phone.
 *
 * Copied from the React package 2.23.0 src/hooks/use-is-mobile.ts.
 */
export const DEFAULT_MOBILE_BREAKPOINT = 768

/**
 * Whether the viewport is narrower than `breakpoint`. React's `useIsMobile`
 * hook as a Svelte class over `MediaQuery`, as shadcn-svelte has it: read
 * `.current`, which updates as the viewport changes.
 */
export class IsMobile extends MediaQuery {
  constructor(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
    super(`max-width: ${breakpoint - 1}px`)
  }
}
