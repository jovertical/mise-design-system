import type { Client } from '#modules/clients/data/types.js'

type Row = [
  name: string,
  industry: string,
  contact: string,
  city: string,
  manager: string,
  status: Client['status'],
  lifetime: number,
]

const ROWS: Row[] = [
  ['Coastal Grocers', 'Grocery', 'R. Lim', 'Riverside', 'J. Okafor', 'active', 3840000],
  ['Bloom & Stem', 'Florist', 'K. Diaz', 'Harbour', 'L. Tan', 'active', 912000],
  ['Northside Hardware', 'Hardware', 'D. Greer', 'Northfield', 'S. Mendez', 'active', 2275000],
  ['Little Bay Bakery', 'Food', 'A. Moreau', 'Harbour', 'L. Tan', 'active', 640500],
  ['Aster Living', 'Home decor', 'N. Patel', 'Riverside', 'J. Okafor', 'active', 1520000],
  ['Summit Office Supply', 'Office', 'G. Hale', 'Northfield', 'S. Mendez', 'active', 2980000],
  ['Greenline Pharmacy', 'Health', 'V. Osei', 'Riverside', 'P. Novak', 'active', 4410000],
  ['Harbourside Outfitters', 'Apparel', 'F. Quinn', 'Harbour', 'L. Tan', 'active', 1188000],
  ['Fieldstone Farms', 'Agriculture', 'O. Brandt', 'Northfield', 'S. Mendez', 'active', 1730000],
  ['Corner Cycle Works', 'Retail', 'I. Sato', 'Riverside', 'P. Novak', 'paused', 210500],
  ['Maple & Main Books', 'Retail', 'L. Byrne', 'Riverside', 'J. Okafor', 'active', 384000],
  ['Tidewater Seafood', 'Food', 'M. Kowal', 'Harbour', 'L. Tan', 'active', 5090000],
  ['Brightside Pet Supply', 'Retail', 'S. Achebe', 'Northfield', 'S. Mendez', 'active', 830000],
  [
    'Oakridge Builders',
    'Construction',
    'T. Ferreira',
    'Northfield',
    'S. Mendez',
    'paused',
    1460000,
  ],
]

export const CLIENTS: Client[] = ROWS.map(
  ([name, industry, contact, city, manager, status, lifetime]) => ({
    id: `cli-${name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')}`,
    name,
    industry,
    contact,
    email: `${contact.split(' ')[1].toLowerCase()}@${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.example`,
    city,
    manager,
    status,
    lifetimeValue: lifetime,
  }),
)
