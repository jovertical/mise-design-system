import type { Product } from '../types.js'

type Row = [
  sku: string,
  name: string,
  category: Product['category'],
  unit: string,
  price: number,
  reorderPoint: number,
  stock: [location: string, onHand: number, reserved: number][],
]

const RIVERSIDE = 'loc-riverside'
const HARBOUR = 'loc-harbour'
const NORTH = 'loc-north'
const MARKET = 'loc-market'

const ROWS: Row[] = [
  [
    'PK-0410',
    'Pallet wrap, 500 m',
    'packaging',
    'roll',
    1850,
    200,
    [
      [RIVERSIDE, 820, 210],
      [HARBOUR, 420, 100],
    ],
  ],
  ['PK-0422', 'Corner boards ×50', 'packaging', 'pack', 900, 100, [[RIVERSIDE, 40, 30]]],
  [
    'PK-0431',
    'Shipping box, medium',
    'packaging',
    'bundle',
    2400,
    150,
    [
      [RIVERSIDE, 600, 120],
      [NORTH, 310, 40],
      [MARKET, 90, 10],
    ],
  ],
  [
    'PK-0432',
    'Shipping box, large',
    'packaging',
    'bundle',
    3100,
    120,
    [
      [RIVERSIDE, 410, 90],
      [HARBOUR, 220, 30],
    ],
  ],
  [
    'PK-0450',
    'Void fill, 1 m³',
    'packaging',
    'bag',
    1200,
    80,
    [
      [HARBOUR, 160, 20],
      [NORTH, 95, 15],
    ],
  ],
  [
    'PK-0462',
    'Packing tape, 66 m',
    'packaging',
    'case',
    2850,
    60,
    [
      [RIVERSIDE, 35, 12],
      [MARKET, 8, 2],
    ],
  ],
  [
    'PL-1001',
    'Euro pallet, new',
    'pallets',
    'each',
    2200,
    300,
    [
      [RIVERSIDE, 640, 180],
      [HARBOUR, 510, 90],
      [NORTH, 420, 60],
    ],
  ],
  [
    'PL-1004',
    'Euro pallet, refurbished',
    'pallets',
    'each',
    1350,
    250,
    [
      [RIVERSIDE, 380, 60],
      [NORTH, 290, 40],
    ],
  ],
  ['PL-1010', 'Plastic pallet, hygienic', 'pallets', 'each', 6400, 60, [[HARBOUR, 140, 40]]],
  [
    'PL-1020',
    'Pallet collar, 4 hinges',
    'pallets',
    'each',
    1900,
    80,
    [
      [RIVERSIDE, 30, 12],
      [NORTH, 25, 8],
    ],
  ],
  [
    'LB-2001',
    'Shipping labels, 4×6',
    'labels',
    'roll',
    1450,
    100,
    [
      [RIVERSIDE, 360, 40],
      [HARBOUR, 210, 20],
      [MARKET, 60, 4],
    ],
  ],
  [
    'LB-2004',
    'Fragile labels',
    'labels',
    'roll',
    950,
    40,
    [
      [RIVERSIDE, 120, 10],
      [NORTH, 80, 6],
    ],
  ],
  [
    'LB-2010',
    'Thermal ribbon, 110 mm',
    'labels',
    'box',
    4200,
    30,
    [
      [RIVERSIDE, 44, 6],
      [HARBOUR, 18, 2],
    ],
  ],
  ['LB-2012', 'Hazard diamonds, class 3', 'labels', 'pack', 1600, 20, [[NORTH, 52, 0]]],
  [
    'CC-3001',
    'Gel ice pack, 1 kg',
    'cold-chain',
    'case',
    3600,
    120,
    [
      [HARBOUR, 300, 80],
      [RIVERSIDE, 220, 60],
    ],
  ],
  [
    'CC-3004',
    'Insulated liner, medium',
    'cold-chain',
    'pack',
    5200,
    50,
    [
      [HARBOUR, 90, 30],
      [RIVERSIDE, 70, 20],
    ],
  ],
  ['CC-3008', 'Temperature logger', 'cold-chain', 'each', 3800, 40, [[HARBOUR, 22, 14]]],
  ['CC-3012', 'Dry ice, 10 kg', 'cold-chain', 'box', 2900, 30, [[HARBOUR, 64, 16]]],
  [
    'SF-4001',
    'Hi-vis vest',
    'safety',
    'each',
    650,
    60,
    [
      [RIVERSIDE, 140, 10],
      [HARBOUR, 90, 6],
      [NORTH, 75, 4],
      [MARKET, 20, 0],
    ],
  ],
  [
    'SF-4004',
    'Cut-resistant gloves',
    'safety',
    'pair',
    890,
    100,
    [
      [RIVERSIDE, 240, 20],
      [NORTH, 130, 10],
    ],
  ],
  [
    'SF-4008',
    'Safety boots, size mix',
    'safety',
    'pair',
    7400,
    20,
    [
      [RIVERSIDE, 36, 4],
      [HARBOUR, 18, 2],
    ],
  ],
  [
    'SF-4012',
    'First aid kit, vehicle',
    'safety',
    'each',
    4500,
    15,
    [
      [RIVERSIDE, 30, 2],
      [NORTH, 12, 1],
    ],
  ],
  [
    'SF-4016',
    'Wheel chocks, pair',
    'safety',
    'pair',
    2100,
    12,
    [
      [HARBOUR, 26, 0],
      [NORTH, 14, 0],
    ],
  ],
  [
    'SF-4020',
    'Strap ratchet, 5 m',
    'safety',
    'each',
    1550,
    80,
    [
      [RIVERSIDE, 210, 30],
      [HARBOUR, 140, 20],
      [NORTH, 96, 10],
    ],
  ],
]

export const PRODUCTS: Product[] = ROWS.map(
  ([sku, name, category, unit, price, reorderPoint, stock]) => ({
    id: `prd-${sku.toLowerCase()}`,
    sku,
    name,
    category,
    unit,
    price,
    reorderPoint,
    stock: stock.map(([locationId, onHand, reserved]) => ({ locationId, onHand, reserved })),
  }),
)
