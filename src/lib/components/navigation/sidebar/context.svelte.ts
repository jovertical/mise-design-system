/**
 * Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarContext`, `useSidebar`), itself shadcn/ui new-york `sidebar`
 * Diverged: React's context and callbacks become a reactive class in Svelte
 *   context, as shadcn-svelte has it. `open` is read through a getter so
 *   `bind:open` on SidebarProvider stays the source of truth.
 */
import { getContext, setContext } from 'svelte'

import { DEFAULT_MOBILE_BREAKPOINT, IsMobile } from '../../../hooks/is-mobile.svelte.js'

export const SIDEBAR_COOKIE_NAME = 'sidebar_state'
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = '16rem'
export const SIDEBAR_WIDTH_MOBILE = '18rem'
export const SIDEBAR_WIDTH_ICON = '56px'
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

export interface SidebarStateProps {
  open: () => boolean
  setOpen: (open: boolean) => void
  mobileBreakpoint?: number
}

export class SidebarState {
  readonly #props: SidebarStateProps
  readonly #isMobile: IsMobile
  openMobile = $state(false)
  open = $derived.by(() => this.#props.open())
  state = $derived.by(() => (this.open ? 'expanded' : 'collapsed'))

  constructor(props: SidebarStateProps) {
    this.#props = props
    this.#isMobile = new IsMobile(props.mobileBreakpoint ?? DEFAULT_MOBILE_BREAKPOINT)
  }

  get isMobile(): boolean {
    return this.#isMobile.current
  }

  setOpen = (value: boolean) => {
    this.#props.setOpen(value)

    // The sidebar persists its open state to a cookie so a reload matches the
    // last choice, as upstream shadcn does.
    // biome-ignore lint/suspicious/noDocumentCookie: upstream shadcn behaviour
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }

  setOpenMobile = (value: boolean) => {
    this.openMobile = value
  }

  toggle = () => {
    if (this.isMobile) this.openMobile = !this.openMobile
    else this.setOpen(!this.open)
  }

  handleShortcutKeydown = (event: KeyboardEvent) => {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()

      this.toggle()
    }
  }
}

const KEY = Symbol.for('mise-sidebar')

export function setSidebar(props: SidebarStateProps): SidebarState {
  return setContext(KEY, new SidebarState(props))
}

/** The sidebar's state, from inside a SidebarProvider. It is a class instance; do not destructure it. */
export function useSidebar(): SidebarState {
  const sidebar = getContext<SidebarState | undefined>(KEY)

  if (!sidebar) throw new Error('useSidebar must be used within a SidebarProvider.')

  return sidebar
}
