import type { Source } from '../shared.js'
import type { Settings } from '../types.js'
import { settingsSchema } from './schema.js'

export const getSettings = (s: Source): Settings => s.data.settings

export function saveSettings(s: Source, next: Settings): Settings {
  s.data.settings = settingsSchema.parse(next)

  return s.data.settings
}
