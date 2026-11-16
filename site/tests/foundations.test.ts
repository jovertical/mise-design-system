import { SEMANTIC_TOKENS } from '@jovertical/mise-design-system/tokens'
import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import TokenSwatches from '../src/modules/docs/components/token-swatches.svelte'

describe('TokenSwatches', () => {
  it('draws every semantic token from its variable', () => {
    const { container } = render(TokenSwatches, { tokens: SEMANTIC_TOKENS })
    const swatches = container.querySelectorAll<HTMLElement>('[data-token]')

    expect(swatches).toHaveLength(SEMANTIC_TOKENS.length)

    expect(swatches[0].style.background).toBe('var(--background)')
  })
})
