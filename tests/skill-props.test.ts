import { describe, expect, it } from 'vitest'

import { folderExports } from '../scripts/skill/exports.js'
import { propDefaults, propsDoc } from '../scripts/skill/props.js'
import { scripts } from '../scripts/skill/svelte-source.js'

const COMPONENT = `<!--
  Origin: x
  Diverged: none
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A short label on a row.
   *
   * A second paragraph that the summary leaves out.
   */
  export type ThingProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /**
     * \`soft\` is a state.
     *
     * More detail.
     */
    variant?: 'soft' | 'solid'
    count: number
    label?: string
  }
</script>

<script lang="ts">
  let { variant = 'soft', count, label, ref = $bindable(null), open = $bindable(), ...rest }: ThingProps = $props()
</script>

<div></div>`

describe('scripts', () => {
  it('splits the module script from the instance script', () => {
    const { module, instance } = scripts(COMPONENT)
    expect(module).toContain('export type ThingProps')
    expect(instance).toContain('$props()')
    expect(instance).not.toContain('export type')
  })

  it('returns null for a script the file does not have', () => {
    expect(scripts('<div></div>')).toEqual({ module: null, instance: null })
  })
})

describe('propsDoc', () => {
  const doc = propsDoc(scripts(COMPONENT).module ?? '', 'ThingProps')

  it('takes the first paragraph of the type JSDoc as the summary', () => {
    expect(doc?.summary).toBe('A short label on a row.')
  })

  it('lists the members declared on the type, with JSDoc first paragraphs', () => {
    expect(doc?.props).toEqual([
      {
        name: 'variant',
        type: "'soft' | 'solid'",
        optional: true,
        default: null,
        description: '`soft` is a state.',
      },
      { name: 'count', type: 'number', optional: false, default: null, description: '' },
      { name: 'label', type: 'string', optional: true, default: null, description: '' },
    ])
  })

  it('summarises the other operands of the intersection', () => {
    expect(doc?.alsoTakes).toEqual(['every `<div>` attribute'])
  })

  it('returns null when the type is not there', () => {
    expect(propsDoc('export type Other = {}', 'ThingProps')).toBeNull()
  })

  it.each([
    ['WithElementRef<HTMLAnchorAttributes>', 'every `<a>` attribute'],
    [
      "Omit<HTMLAttributes<HTMLDivElement>, 'children'>",
      'every `<div>` attribute except `children`',
    ],
    ['SelectPrimitive.TriggerProps', 'bits-ui `Select.Trigger` props'],
    ['NumberInputFieldProps', 'everything `NumberInputField` takes'],
    ['HTMLInputAttributes', 'every `<input>` attribute'],
  ])('summarises %s', (operand, expected) => {
    const source = `export type XProps = ${operand} & { a?: string }`
    expect(propsDoc(source, 'XProps')?.alsoTakes).toEqual([expected])
  })

  it('summarises a union as one "also takes" entry per side', () => {
    const source =
      "export type XProps = ({ type?: 'single' } & SelectPrimitive.RootProps) | SelectPrimitive.RootProps"
    expect(propsDoc(source, 'XProps')?.alsoTakes).toEqual(['bits-ui `Select.Root` props'])
  })
})

describe('propDefaults', () => {
  it('reads defaults from the $props() destructuring', () => {
    const defaults = propDefaults(scripts(COMPONENT).instance ?? '')
    expect(defaults.get('variant')).toBe("'soft'")
    expect(defaults.get('count')).toBeNull()
    expect(defaults.get('ref')).toBe('null')
    expect(defaults.get('open')).toBeNull()
    expect(defaults.has('rest')).toBe(false)
  })
})

describe('folderExports', () => {
  it('reads components, types and values from an index.ts', () => {
    const source = `export { type BadgeProps, default as Badge } from './badge.svelte'
export { type BadgeVariant, badgeVariants } from './badge-variants.js'`
    expect(folderExports(source)).toEqual([
      { name: 'BadgeProps', from: './badge.svelte', component: false, typeOnly: true },
      { name: 'Badge', from: './badge.svelte', component: true, typeOnly: false },
      { name: 'BadgeVariant', from: './badge-variants.js', component: false, typeOnly: true },
      { name: 'badgeVariants', from: './badge-variants.js', component: false, typeOnly: false },
    ])
  })
})
