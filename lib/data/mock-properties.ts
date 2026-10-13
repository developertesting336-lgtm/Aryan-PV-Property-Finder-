export interface PropertyRecord {
  id: string;
  slug: string;
  title: string;
  location: string;
  neighborhood: string;
  address: string;
  price: number;
  priceUsd: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  sqft: number;
  propertyType: string;
  image: string;
  media: Array<{ url: string; caption: string; isPrimary?: boolean }>;
  description: string;
  featured: boolean;
  oceanView: boolean;
  beachfront: boolean;
  pool: boolean;
  amenities: string[];
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    avatar: string;
  };
  createdAt: string;
}

export const INITIAL_PROPERTIES: PropertyRecord[] = [
  {
    id: 'prop-1',
    slug: 'oceanfront-luxury-penthouse',
    title: 'Oceanfront Luxury Penthouse',
    location: 'Zona Romántica, Puerto Vallarta',
    neighborhood: 'Zona Romántica',
    address: 'Calle Amapas 142, Zona Romántica, Puerto Vallarta, JAL 48399',
    price: 685000,
    priceUsd: 685000,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 204,
    sqft: 2200,
    propertyType: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
    media: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85', caption: 'Panoramic Living Room & Terrace', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85', caption: 'Private Rooftop Plunge Pool' },
      { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85', caption: 'Chef Kitchen & Dining' },
      { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85', caption: 'Primary Ocean Suite' },
    ],
    description: 'Breathtaking top-floor oceanfront residence overlooking Banderas Bay with wrap-around sunset terraces, direct private elevator access, and rooftop plunge pool. Steps from Los Muertos Beach, Basilio Badillo fine dining, and vibrant nightlife.',
    featured: true,
    oceanView: true,
    beachfront: true,
    pool: true,
    amenities: ['Private Rooftop Pool', 'Direct Beach Access', 'Wrap-around Terrace', '24/7 Concierge & Security', 'Underground Parking', 'Smart Home Automation'],
    agent: {
      id: 'agent-1',
      name: 'Alejandro Morales',
      email: 'amorales@pvproperties.mx',
      phone: '+52 322 100 2345',
      whatsapp: '523221002345',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    createdAt: new Date('2026-03-01').toISOString(),
  },
  {
    id: 'prop-2',
    slug: 'conchas-chinas-cliffside-villa',
    title: 'Conchas Chinas Cliffside Villa',
    location: 'Conchas Chinas, Puerto Vallarta',
    neighborhood: 'Conchas Chinas',
    address: 'Carretera a Barra de Navidad Km 2.5, Conchas Chinas, Puerto Vallarta',
    price: 1450000,
    priceUsd: 1450000,
    bedrooms: 5,
    bathrooms: 5.5,
    area: 480,
    sqft: 5160,
    propertyType: 'Villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85',
    media: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85', caption: 'Cliffside Infinity Pool & Pacific View', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85', caption: 'Expansive Outdoor Lounge' },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85', caption: 'Master Suite with Ocean Panorama' },
    ],
    description: 'An architectural masterpiece sculpted into the granite cliffs of Conchas Chinas. Features cantilevered travertine sun decks, a heated saltwater infinity pool, custom Parota wood cabinetry, and a private pathway down to secluded turquoise tidal coves.',
    featured: true,
    oceanView: true,
    beachfront: false,
    pool: true,
    amenities: ['Saltwater Infinity Pool', 'Private Beach Cove Trail', 'Parota Woodwork', 'Wine Cellar', 'Gated Estate Grounds', 'Solar Power Array'],
    agent: {
      id: 'agent-1',
      name: 'Alejandro Morales',
      email: 'amorales@pvproperties.mx',
      phone: '+52 322 100 2345',
      whatsapp: '523221002345',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    createdAt: new Date('2026-03-05').toISOString(),
  },
  {
    id: 'prop-3',
    slug: 'marina-promenade-condo',
    title: 'Marina Promenade Golf & Yacht Condo',
    location: 'Marina Vallarta, Puerto Vallarta',
    neighborhood: 'Marina Vallarta',
    address: 'Paseo de la Marina Sur 220, Marina Vallarta, Puerto Vallarta',
    price: 485000,
    priceUsd: 485000,
    bedrooms: 2,
    bathrooms: 2,
    area: 145,
    sqft: 1560,
    propertyType: 'Condo',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85',
    media: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85', caption: 'Spacious Open Plan Interior', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85', caption: 'Boardwalk Marina View' },
    ],
    description: 'Overlooking the 500-slip Marina yacht basin with direct access to golf greens and tree-lined boardwalk bistros. High ceilings, expansive covered terrace, rental-ready turnkey furnishings, and resort-style lap pools.',
    featured: true,
    oceanView: false,
    beachfront: false,
    pool: true,
    amenities: ['Yacht Slip Access', 'Championship Golf Proximity', 'Resort Lap Pool', 'Covered Parking', 'Tennis Courts', 'Turnkey Furnished'],
    agent: {
      id: 'agent-2',
      name: 'Sofia Valenzuela',
      email: 'sofia@pvproperties.mx',
      phone: '+52 322 987 6543',
      whatsapp: '523229876543',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    createdAt: new Date('2026-03-10').toISOString(),
  },
  {
    id: 'prop-4',
    slug: 'versalles-botanical-terrace-condo',
    title: 'Versalles Botanical Terrace Condo',
    location: 'Versalles, Puerto Vallarta',
    neighborhood: 'Versalles',
    address: 'Calle Francia 380, Versalles, Puerto Vallarta',
    price: 329000,
    priceUsd: 329000,
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    sqft: 1184,
    propertyType: 'Condo',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85',
    media: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85', caption: 'Modern Minimalist Living Space', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85', caption: 'Rooftop Terrace & Sunset Bar' },
    ],
    description: 'Located in the culinary heart of Puerto Vallarta. Walk to micro-bakeries, award-winning taco venues, and organic roasteries. Excellent Airbnb cashflow asset with rooftop heated plunge pool and mountain views.',
    featured: false,
    oceanView: false,
    beachfront: false,
    pool: true,
    amenities: ['Rooftop Infinity Plunge Pool', 'High Rental Cap Rate', 'Gym & Coworking Lounge', 'Pet Friendly', 'Storage Locker', 'High-Speed Fiber'],
    agent: {
      id: 'agent-2',
      name: 'Sofia Valenzuela',
      email: 'sofia@pvproperties.mx',
      phone: '+52 322 987 6543',
      whatsapp: '523229876543',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    createdAt: new Date('2026-03-12').toISOString(),
  },
  {
    id: 'prop-5',
    slug: 'amapas-sunset-canopy-villa',
    title: 'Amapas Sunset Canopy Villa',
    location: 'Amapas, Puerto Vallarta',
    neighborhood: 'Amapas',
    address: 'Calle Hortensias 502, Amapas, Puerto Vallarta',
    price: 975000,
    priceUsd: 975000,
    bedrooms: 4,
    bathrooms: 4.5,
    area: 360,
    sqft: 3875,
    propertyType: 'Villa',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
    media: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85', caption: 'Lush Jungle Canopy & Bay Views', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85', caption: 'Sunset Pool Deck' },
    ],
    description: 'Elevated luxury sanctuary where tropical Sierra Madre jungle meets open Pacific horizons. Double-height ceilings, private infinity edge pool, floor-to-ceiling retractable glass pocket walls, and serene privacy just 4 minutes from Zona Romántica.',
    featured: true,
    oceanView: true,
    beachfront: false,
    pool: true,
    amenities: ['Double-height Ceilings', 'Infinity Edge Bay Pool', 'Pocket Glass Walls', 'Outdoor BBQ Kitchen', 'Private Garage', 'Security Monitored'],
    agent: {
      id: 'agent-1',
      name: 'Alejandro Morales',
      email: 'amorales@pvproperties.mx',
      phone: '+52 322 100 2345',
      whatsapp: '523221002345',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    createdAt: new Date('2026-03-15').toISOString(),
  },
  {
    id: 'prop-6',
    slug: '5-de-diciembre-camarones-studio',
    title: 'Camarones Beach Designer Studio',
    location: '5 de Diciembre, Puerto Vallarta',
    neighborhood: '5 de Diciembre',
    address: 'Calle Honduras 210, 5 de Diciembre, Puerto Vallarta',
    price: 245000,
    priceUsd: 245000,
    bedrooms: 1,
    bathrooms: 1,
    area: 58,
    sqft: 624,
    propertyType: 'Studio',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85',
    media: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85', caption: 'Bright Scandinavian Coastal Studio', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85', caption: '2 Blocks to Camarones Beach' },
    ],
    description: 'Chic, turnkey coastal pied-à-terre two blocks from Camarones Beach and the boardwalk Malecón. Features polished concrete finishes, custom carpentry, low HOA fees, and strong rental demand year-round.',
    featured: false,
    oceanView: true,
    beachfront: false,
    pool: false,
    amenities: ['2 Blocks to Beach', 'Rooftop Sundeck', 'Low HOA Fees', 'Turnkey Furnished', 'Keyless Lock Access'],
    agent: {
      id: 'agent-2',
      name: 'Sofia Valenzuela',
      email: 'sofia@pvproperties.mx',
      phone: '+52 322 987 6543',
      whatsapp: '523229876543',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    createdAt: new Date('2026-03-18').toISOString(),
  },
];

// In-Memory Storage for Full-Stack State
export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  message?: string;
  source: string;
  status: 'new' | 'contacted' | 'viewing' | 'offer_pending' | 'closed';
  agentAssignedName?: string;
  createdAt: string;
  activities: Array<{ action: string; timestamp: string; details?: string }>;
}

export interface OfferRecord {
  id: string;
  buyerName: string;
  email: string;
  phone: string;
  propertyTitle: string;
  propertyId?: string;
  offerAmountUsd: number;
  financingType: string;
  status: 'pending' | 'accepted' | 'countered' | 'rejected';
  notes?: string;
  counterNotes?: string;
  createdAt: string;
}

export interface ValuationRecord {
  id: string;
  ownerName: string;
  email: string;
  phone: string;
  neighborhood: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  condition: string;
  oceanView: boolean;
  estimatedValueLowUsd: number;
  estimatedValueMidUsd: number;
  estimatedValueHighUsd: number;
  pricePerSqftUsd: number;
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

// Global In-Memory Store
class GlobalInMemoryDb {
  properties: PropertyRecord[] = [...INITIAL_PROPERTIES];
  leads: LeadRecord[] = [
    {
      id: 'lead-1',
      name: 'Jennifer Parker',
      email: 'jparker@vancouver.ca',
      phone: '+1 604 555 0192',
      propertyTitle: 'Oceanfront Luxury Penthouse',
      message: 'Looking for a winter residence with ocean views and 3 bedrooms.',
      source: 'walkthrough_request',
      status: 'contacted',
      agentAssignedName: 'Alejandro Morales',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      activities: [
        { action: 'Inquiry Submitted online', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
        { action: 'WhatsApp intro message sent by broker', timestamp: new Date(Date.now() - 86400000).toISOString() },
      ],
    },
    {
      id: 'lead-2',
      name: 'Robert Vance',
      email: 'rvance@austintx.com',
      phone: '+1 512 555 4321',
      propertyTitle: 'Conchas Chinas Cliffside Villa',
      message: 'Interested in all-cash purchase with 30-day closing.',
      source: 'offer_inquiry',
      status: 'viewing',
      agentAssignedName: 'Alejandro Morales',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      activities: [
        { action: 'Offer interest registered', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { action: 'Private walkthrough confirmed for Friday 11:00 AM', timestamp: new Date().toISOString() },
      ],
    },
  ];
  offers: OfferRecord[] = [
    {
      id: 'offer-1',
      buyerName: 'Robert Vance',
      email: 'rvance@austintx.com',
      phone: '+1 512 555 4321',
      propertyTitle: 'Conchas Chinas Cliffside Villa',
      propertyId: 'prop-2',
      offerAmountUsd: 1380000,
      financingType: 'cash',
      status: 'countered',
      notes: 'All cash escrow, requesting 30 day close.',
      counterNotes: 'Seller countered at $1,420,000 USD including turnkey Parota furnishings.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'offer-2',
      buyerName: 'Emily Watson',
      email: 'emily.watson@gmail.com',
      phone: '+1 206 555 8910',
      propertyTitle: 'Oceanfront Luxury Penthouse',
      propertyId: 'prop-1',
      offerAmountUsd: 660000,
      financingType: 'mexican_bank_fideicomiso',
      status: 'pending',
      notes: 'Fideicomiso transfer, proof of funds provided.',
      createdAt: new Date().toISOString(),
    },
  ];
  valuations: ValuationRecord[] = [
    {
      id: 'val-1',
      ownerName: 'Carlos Mendoza',
      email: 'carlos@example.com',
      phone: '+52 322 100 2345',
      neighborhood: 'Zona Romántica',
      propertyType: 'condo',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1400,
      condition: 'excellent',
      oceanView: true,
      estimatedValueLowUsd: 495000,
      estimatedValueMidUsd: 535000,
      estimatedValueHighUsd: 575000,
      pricePerSqftUsd: 382,
      createdAt: new Date().toISOString(),
    },
  ];
  contacts: ContactRecord[] = [
    { id: 'contact-1', name: 'Jennifer Parker', email: 'jparker@vancouver.ca', phone: '+1 604 555 0192', createdAt: new Date().toISOString() },
    { id: 'contact-2', name: 'Robert Vance', email: 'rvance@austintx.com', phone: '+1 512 555 4321', createdAt: new Date().toISOString() },
    { id: 'contact-3', name: 'Emily Watson', email: 'emily.watson@gmail.com', phone: '+1 206 555 8910', createdAt: new Date().toISOString() },
  ];
  bloomFilterBitset: Set<string> = new Set([
    'jparker@vancouver.ca',
    'rvance@austintx.com',
    'emily.watson@gmail.com',
    'alejandro',
    'amorales@pvproperties.mx',
    '+52 322 100 2345',
    '+1 604 555 0192',
    '+1 512 555 4321',
  ]);
  cacheSentinelStore: Map<string, { value: any; expiresAt: number }> = new Map();
  queueJobs: Array<{ id: string; jobName: string; data: any; status: string; timestamp: string }> = [
    { id: 'job-1', jobName: 'dispatch_whatsapp_broker_alert', data: { leadName: 'Jennifer Parker' }, status: 'completed', timestamp: new Date().toISOString() },
    { id: 'job-2', jobName: 'send_buyer_cma_valuation_pdf', data: { ownerName: 'Carlos Mendoza' }, status: 'completed', timestamp: new Date().toISOString() },
  ];
}

const globalForDb = globalThis as unknown as { inMemoryDb?: GlobalInMemoryDb };
export const mockDb = globalForDb.inMemoryDb ?? new GlobalInMemoryDb();
if (process.env.NODE_ENV !== 'production') globalForDb.inMemoryDb = mockDb;
