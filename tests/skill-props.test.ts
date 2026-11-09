import { describe, expect, it } from 'vitest'
import { literalAliases } from '../scripts/skill/aliases.js'
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

describe('literalAliases', () => {
  const files = [
    "export type Tone = 'neutral' | 'primary'\nexport type Size = 'sm' | 'md' | 'lg'",
    'export type Own = Size\nexport type Loose = string',
    `import { cva, type VariantProps } from 'class-variance-authority'
export const groupVariants = cva('flex', {
  variants: { orientation: { horizontal: 'flex-row', vertical: 'flex-col' } },
})
export type GroupOrientation = NonNullable<
  VariantProps<typeof groupVariants>['orientation']
>`,
  ]
  const aliases = literalAliases(files)

  it('reads unions of literals', () => {
    expect(aliases.get('Tone')).toBe("'neutral' | 'primary'")
  })

  it('follows an alias of an alias', () => {
    expect(aliases.get('Own')).toBe("'sm' | 'md' | 'lg'")
  })

  it('reads the keys of a cva variant', () => {
    expect(aliases.get('GroupOrientation')).toBe("'horizontal' | 'vertical'")
  })

  it('leaves out anything that is not a set of literals', () => {
    expect(aliases.has('Loose')).toBe(false)
  })
})

describe('describe, for the bits-ui wrappers', () => {
  it.each([
    [
      'WithoutChildrenOrChild<CalendarPrimitive.RootProps>',
      'bits-ui `Calendar.Root` props except `children`, `child`',
    ],
    [
      'WithoutChildren<SelectPrimitive.ContentProps>',
      'bits-ui `Select.Content` props except `children`',
    ],
    ['WithoutChild<SelectPrimitive.ItemProps>', 'bits-ui `Select.Item` props except `child`'],
  ])('summarises %s', (operand, expected) => {
    expect(
      propsDoc(`export type XProps = ${operand} & { a?: string }`, 'XProps')?.alsoTakes,
    ).toEqual([expected])
  })
})

describe('describe, through local aliases and imports', () => {
  it('follows a local alias and Extract to the bits-ui type', () => {
    const source = `import { Select as SelectPrimitive } from 'bits-ui'
type Root = SelectPrimitive.RootProps
type Single = Extract<Root, { type: 'single' }>
type Multiple = Extract<Root, { type: 'multiple' }>
export type XProps = (Omit<Single, 'type'> & { type?: 'single' }) | Multiple`
    expect(propsDoc(source, 'XProps')?.alsoTakes).toEqual([
      'bits-ui `Select.Root` props except `type`',
      'bits-ui `Select.Root` props',
    ])
  })

  it('names the package a type is imported from', () => {
    const source = `import { type ToasterProps as SonnerProps } from 'svelte-sonner'
export type XProps = SonnerProps`
    expect(propsDoc(source, 'XProps')?.alsoTakes).toEqual(['`svelte-sonner` `ToasterProps`'])
  })

  it('keeps a sibling part relative import as that part', () => {
    const source = `import type { NumberInputFieldProps } from './number-input-field.svelte'
export type XProps = NumberInputFieldProps & { a?: string }`
    expect(propsDoc(source, 'XProps')?.alsoTakes).toEqual(['everything `NumberInputField` takes'])
  })
})

describe('propsDoc, through local object aliases', () => {
  it('turns a local alias of an object type into rows, merging a prop on both sides of a union', () => {
    const source = `type Single = { mode: 'single'; value?: Date }
type Range = { mode: 'range'; value?: { start: Date; end: Date } }
export type XProps = { open?: boolean } & (Single | Range)`
    expect(propsDoc(source, 'XProps')?.props.map(({ name, type }) => [name, type])).toEqual([
      ['open', 'boolean'],
      ['mode', "'single' | 'range'"],
      ['value', 'Date | { start: Date; end: Date }'],
    ])
  })

  it('phrases Pick as the keys it takes from a part', () => {
    const source = "export type XProps = Pick<ButtonProps, 'variant' | 'size'> & { a?: string }"
    expect(propsDoc(source, 'XProps')?.alsoTakes).toEqual(['`variant`, `size` from `Button`'])
  })
})

describe('propsDoc, inside WithElementRef', () => {
  it('reads members through the wrapper, and parenthesises merged function types', () => {
    const source = `export type XProps = WithElementRef<
  Omit<HTMLInputAttributes, 'type'> &
    ({ type: 'file'; on?: (files: FileList) => void } | { type?: 'text'; on?: (text: string) => void })
>`
    const doc = propsDoc(source, 'XProps')
    expect(doc?.alsoTakes).toEqual(['every `<input>` attribute except `type`'])
    expect(doc?.props.map(({ name, type }) => [name, type])).toEqual([
      ['type', "'file' | 'text'"],
      ['on', '((files: FileList) => void) | ((text: string) => void)'],
    ])
  })
})
