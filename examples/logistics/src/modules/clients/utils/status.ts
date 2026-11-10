/** How the clients module's statuses and labels show: one map each, so every screen agrees. */

import type { Client } from '#modules/clients/data/types.js'
import type { Look } from '#modules/core/utils/look.js'

export const CLIENT_STATUS: Record<Client['status'], Look> = {
  active: { label: 'Active', tone: 'success' },
  paused: { label: 'Paused', tone: 'neutral' },
}
