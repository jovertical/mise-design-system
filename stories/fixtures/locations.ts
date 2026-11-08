/**
 * Story scaffolding, not a package export: devices grouped under their
 * location, for the expandable-rows story and its test. A location holding
 * one device stays flat: a disclosure over a single row reveals nothing.
 */
import { renderComponent } from '@tanstack/svelte-table'

import { dataTableColumns } from '../../src/lib/components/data-display/data-table/features.js'
import DeviceStatus from './device-status.svelte'
import { DEVICES, type Device } from './devices.js'
import LocationCell from './location-cell.svelte'

export type LocationRow =
  | { kind: 'location'; id: string; location: string; devices: Device[] }
  | { kind: 'device'; id: string; device: Device }

export const LOCATION_ROWS: LocationRow[] = [
  ...new Set(DEVICES.map((device) => device.location)),
].map((location) => ({
  kind: 'location',
  id: `location:${location}`,
  location,
  devices: DEVICES.filter((device) => device.location === location),
}))

export const deviceRowsOf = (row: LocationRow): LocationRow[] | undefined =>
  row.kind === 'location' && row.devices.length > 1
    ? row.devices.map((device) => ({ kind: 'device', id: device.id, device }))
    : undefined

const column = dataTableColumns<LocationRow>()

export const locationColumns = column.columns([
  column.display({
    id: 'location',
    header: 'Location',
    cell: ({ row }) => renderComponent(LocationCell, { row }),
  }),
  column.display({
    id: 'status',
    header: 'Status',
    cell: ({ row }) =>
      row.original.kind === 'device'
        ? renderComponent(DeviceStatus, { status: row.original.device.status })
        : null,
  }),
  column.display({
    id: 'lastSeen',
    header: 'Last seen',
    cell: ({ row }) => (row.original.kind === 'device' ? row.original.device.lastSeen : null),
  }),
])
