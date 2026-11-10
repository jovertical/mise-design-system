/** How the fleet module's statuses and labels show: one map each, so every screen agrees. */
import type { Look } from '#modules/core/utils/look.js'
import type { Vehicle } from '#modules/fleet/data/types.js'

export const VEHICLE_STATUS: Record<Vehicle['status'], Look> = {
  'on-route': { label: 'On route', tone: 'success' },
  loading: { label: 'Loading', tone: 'info' },
  idle: { label: 'Idle', tone: 'neutral' },
  workshop: { label: 'In workshop', tone: 'critical' },
}

export const CONDITION: Record<Vehicle['condition'], Look & { note: string }> = {
  excellent: { label: 'Excellent', tone: 'success', note: 'Serviced and road-ready' },
  good: { label: 'Good', tone: 'info', note: 'Minor wear logged' },
  'service-due': { label: 'Service due', tone: 'warning', note: 'Due within 30 days' },
  overdue: { label: 'Overdue', tone: 'critical', note: 'Service date passed' },
}
