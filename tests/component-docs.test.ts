// @vitest-environment node
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { componentDocs, PACKAGE } from '../scripts/skill/component-docs.js'
import { componentFolders } from './groups.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docs = componentDocs(root)
const folderNamed = (name: string) => docs.find((doc) => doc.name === name)

describe('componentDocs', () => {
  it('has one entry per component folder, in group then folder order', () => {
    const paths = docs.map((doc) => `${doc.group}/${doc.folder}`)

    expect(paths).toEqual(
      componentFolders()
        .map(({ path }) => path)
        .toSorted(),
    )
  })

  it('puts the root part first and spells literal types out', () => {
    const button = folderNamed('Button')

    expect(button?.entry).toBe(PACKAGE)

    expect(button?.parts[0].name).toBe('Button')

    const variant = button?.parts[0].props.find((prop) => prop.name === 'variant')

    expect(variant?.type).toBe("'solid' | 'soft' | 'outline' | 'ghost' | 'link'")

    expect(variant?.default).toBe("'solid'")
  })

  it('lists every part of a compound component with its defaults', () => {
    const dialog = folderNamed('Dialog')
    const content = dialog?.parts.find((part) => part.name === 'DialogContent')

    expect(dialog?.group).toBe('overlays')

    expect(content?.documented).toBe(true)

    expect(content?.props.find((prop) => prop.name === 'showCloseButton')?.default).toBe('true')
  })

  it('gives a form folder the /form entry', () => {
    expect(docs.filter((doc) => doc.entry === `${PACKAGE}/form`).length).toBeGreaterThan(0)
  })
})
