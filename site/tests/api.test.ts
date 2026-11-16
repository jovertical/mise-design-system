// @vitest-environment node
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { componentDocs } from '../../scripts/skill/component-docs.js'
import { folderNamed, partNamed } from '../src/modules/docs/data/api.js'
import { apiAnchor } from '../src/modules/docs/utils/anchors.js'

const docs = componentDocs(join(import.meta.dirname, '..', '..'))

describe('the API lookups', () => {
  it('finds a folder by its root part', () => {
    expect(folderNamed('Dialog', docs).group).toBe('overlays')
  })

  it('finds a part in any folder', () => {
    expect(partNamed('DialogContent', docs).folder.name).toBe('Dialog')
  })

  it('throws on a name mise does not have, so the build fails', () => {
    expect(() => folderNamed('Dialogue', docs)).toThrow('No component named Dialogue in mise')

    expect(() => partNamed('DialogBody', docs)).toThrow('No part named DialogBody in mise')
  })

  it('anchors a part in kebab case', () => {
    expect(apiAnchor('DialogContent')).toBe('api-dialog-content')
  })
})
