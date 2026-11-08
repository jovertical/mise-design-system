import '@testing-library/jest-dom/vitest'

/**
 * Browser APIs jsdom does not implement, stubbed so component tests can run.
 * Deliberately inert: nothing asserts on them. They exist so the components
 * under test get far enough to be asserted on.
 *
 * Copied from the React package 2.23.0 tests/setup.ts.
 */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

class DOMRectStub {
  x = 0
  y = 0
  width = 0
  height = 0
  top = 0
  left = 0
  right = 0
  bottom = 0
  toJSON() {
    return this
  }
}

globalThis.DOMRect ??= DOMRectStub as unknown as typeof DOMRect

// bits-ui's PinInput probes for password-manager badges with elementFromPoint,
// which jsdom does not implement.
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

// svelte-sonner reads the colour-scheme media query on mount. Inert: it
// reports "light" and never fires, which is all a test of the toaster needs.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
