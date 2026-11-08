/**
 * Story scaffolding, not a package export: a fixed set of devices for the
 * DataTable stories. Fixed rather than generated, so a screenshot compares
 * against last week's.
 */
import { renderComponent } from '@tanstack/svelte-table'
import DataTableColumnHeader from '../../src/lib/components/data-display/data-table/data-table-column-header.svelte'
import { dataTableColumns } from '../../src/lib/components/data-display/data-table/features.js'
import DeviceStatus from './device-status.svelte'

export type Device = {
  id: string
  serial: string
  location: string
  status: 'online' | 'offline' | 'pairing'
  lastSeen: string
}

export const DEVICES: Device[] = [
  {
    id: '1',
    serial: 'RG-0041',
    location: 'Riverside',
    status: 'online',
    lastSeen: '2 minutes ago',
  },
  {
    id: '2',
    serial: 'RG-0042',
    location: 'Riverside',
    status: 'online',
    lastSeen: '4 minutes ago',
  },
  { id: '3', serial: 'RG-0107', location: 'Harbour', status: 'offline', lastSeen: '3 days ago' },
  { id: '4', serial: 'RG-0108', location: 'Harbour', status: 'pairing', lastSeen: 'never' },
  {
    id: '5',
    serial: 'RG-0211',
    location: 'North yard',
    status: 'online',
    lastSeen: '1 minute ago',
  },
  {
    id: '6',
    serial: 'RG-0212',
    location: 'North yard',
    status: 'offline',
    lastSeen: '6 hours ago',
  },
]

export const STATUS_TONE = { online: 'success', offline: 'critical', pairing: 'warning' } as const

export const STATUS_OPTIONS = [
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Pairing', value: 'pairing' },
]

const column = dataTableColumns<Device>()

export const deviceColumns = column.columns([
  column.accessor('serial', {
    header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Serial' }),
  }),
  column.accessor('location', {
    header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Location' }),
  }),
  column.accessor('status', {
    header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => renderComponent(DeviceStatus, { status: row.original.status }),
  }),
  // Plain text on purpose: a header that does not sort renders as one that does.
  column.accessor('lastSeen', { header: 'Last seen', enableSorting: false }),
])
