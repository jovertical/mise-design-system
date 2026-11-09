import type { Vehicle } from '../types.js'

type Row = [
  code: string,
  registration: string,
  type: Vehicle['type'],
  home: string,
  driver: string | null,
  status: Vehicle['status'],
  mileageKm: number,
  nextServiceDay: number,
  condition: Vehicle['condition'],
]

const ROWS: Row[] = [
  ['VAN-014', 'RV-2047', 'van', 'loc-riverside', 'drv-reyes', 'on-route', 48210, 40, 'excellent'],
  ['TRK-208', 'HB-1000', 'truck', 'loc-harbour', 'drv-cole', 'on-route', 112870, 5, 'service-due'],
  ['VAN-016', 'RV-2051', 'van', 'loc-riverside', 'drv-ibrahim', 'on-route', 36400, 62, 'excellent'],
  ['VAN-018', 'NF-1188', 'van', 'loc-north', 'drv-park', 'on-route', 71250, 21, 'good'],
  ['TRK-210', 'HB-1012', 'truck', 'loc-harbour', 'drv-santos', 'on-route', 98330, 3, 'service-due'],
  ['VAN-020', 'MS-0310', 'van', 'loc-market', 'drv-walsh', 'on-route', 22190, 88, 'excellent'],
  ['TRK-212', 'NF-1203', 'truck', 'loc-north', 'drv-nguyen', 'on-route', 134900, -4, 'overdue'],
  ['VAN-024', 'RV-2066', 'van', 'loc-riverside', 'drv-fischer', 'loading', 15600, 120, 'excellent'],
  ['VAN-022', 'NF-1698', 'van', 'loc-north', null, 'workshop', 89010, 6, 'good'],
  ['TRK-214', 'HB-1020', 'truck', 'loc-harbour', null, 'loading', 64100, 45, 'good'],
  ['VAN-026', 'RV-2071', 'van', 'loc-riverside', null, 'idle', 9800, 150, 'excellent'],
  ['VAN-028', 'MS-0322', 'van', 'loc-market', null, 'idle', 12450, 132, 'excellent'],
]

export const VEHICLES: Vehicle[] = ROWS.map(
  ([code, registration, type, home, driver, status, mileageKm, nextServiceDay, condition]) => ({
    id: `veh-${code.toLowerCase()}`,
    code,
    registration,
    type,
    homeLocationId: home,
    driverId: driver,
    status,
    mileageKm,
    nextServiceDay,
    condition,
  }),
)
