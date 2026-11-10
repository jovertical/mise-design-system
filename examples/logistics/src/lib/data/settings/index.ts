import type { Source } from '../shared.js'
import type { Settings } from '../types.js'
import { settingsSchema } from './schema.js'

export const getSettings = (source: Source): Settings => source.data.settings

export function saveSettings(source: Source, next: Settings): Settings {
  source.data.settings = settingsSchema.parse(next)

  return source.data.settings
}
