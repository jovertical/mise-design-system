import type { Location } from '../types.js'

export const LOCATIONS: Location[] = [
  {
    id: 'loc-riverside',
    name: 'Riverside DC',
    city: 'Riverside',
    manager: 'J. Okafor',
    capacityUnits: 12000,
    docks: 8,
    zones: [
      { name: 'Zone A', used: 2790, capacity: 3000 },
      { name: 'Zone B', used: 2560, capacity: 4000 },
      { name: 'Cold', used: 1650, capacity: 2000 },
      { name: 'Bulk', used: 2360, capacity: 3000 },
    ],
  },
  {
    id: 'loc-harbour',
    name: 'Harbour Hub',
    city: 'Harbour',
    manager: 'L. Tan',
    capacityUnits: 9000,
    docks: 6,
    zones: [
      { name: 'Zone A', used: 1500, capacity: 3000 },
      { name: 'Cold', used: 1420, capacity: 2000 },
      { name: 'Bulk', used: 1940, capacity: 4000 },
    ],
  },
  {
    id: 'loc-north',
    name: 'North Yard',
    city: 'Northfield',
    manager: 'S. Mendez',
    capacityUnits: 7000,
    docks: 4,
    zones: [
      { name: 'Zone A', used: 2100, capacity: 3000 },
      { name: 'Bulk', used: 2640, capacity: 4000 },
    ],
  },
  {
    id: 'loc-market',
    name: 'Market Street',
    city: 'Riverside',
    manager: 'P. Novak',
    capacityUnits: 3000,
    docks: 2,
    zones: [
      { name: 'Front', used: 980, capacity: 1500 },
      { name: 'Back', used: 1040, capacity: 1500 },
    ],
  },
]
