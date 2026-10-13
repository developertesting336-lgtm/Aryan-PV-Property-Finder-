import { NextResponse } from 'next/server';

const NEIGHBORHOODS_DATA = [
  {
    id: 'zona-romantica',
    name: 'Zona Romántica',
    description: 'The historic, beating heart of Puerto Vallarta. Cobblestone streets lined with bougainvillea, world-class dining, bustling cafes, and direct access to Los Muertos Beach and the iconic sail pier.',
    averagePriceUsd: 450000,
    vibe: 'Walkable, Vibrant & Culinary',
    highlight: 'Los Muertos Pier, Basilio Badillo Restaurant Row, vibrant beach clubs.',
    imageUrl: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'marina-vallarta',
    name: 'Marina Vallarta',
    description: 'A nautical haven of tranquility featuring a 500-slip world-class yacht harbor, an 18-hole championship golf course, top international private schools, and a scenic perimeter boardwalk.',
    averagePriceUsd: 590000,
    vibe: 'Yachting, Golf & Family Peaceful',
    highlight: '500-slip Marina boardwalk, lighthouse restaurant, golf club.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'conchas-chinas',
    name: 'Conchas Chinas',
    description: 'Often referred to as the "Beverly Hills of Puerto Vallarta." Dramatically situated where the Sierra Madre mountains plunge directly into turquoise Pacific tidal pools.',
    averagePriceUsd: 1250000,
    vibe: 'Ultra-Luxury, Secluded & Cliffside',
    highlight: 'Turquoise private coves, unobstructed Pacific sunsets, multi-million dollar estates.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'versalles',
    name: 'Versalles',
    description: 'The premier culinary epicenter of Puerto Vallarta. A thriving neighborhood packed with micro-roasters, French bakeries, gourmet taco stands, and high rental demand.',
    averagePriceUsd: 320000,
    vibe: 'Foodie Capital & Digital Nomad Hub',
    highlight: 'Award-winning gastronomy, high rental cap rate, authentic community.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'amapas',
    name: 'Amapas',
    description: 'Elevated just above Zona Romántica, offering bird’s-eye views of Banderas Bay while remaining within walking distance of Old Town beaches and nightlife.',
    averagePriceUsd: 540000,
    vibe: 'Scenic Ocean Panoramas & Modern Architecture',
    highlight: 'Panoramic sunset balconies, lush jungle backdrop, modern high-rises.',
    imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'fluvial-vallarta',
    name: 'Fluvial Vallarta',
    description: 'A master-planned residential community in the geographical center of the bay. Wide avenues, underground utilities, manicured parks, and top clinics.',
    averagePriceUsd: 480000,
    vibe: 'Suburban Comfort & Master-Planned Living',
    highlight: 'Central park green belts, underground utilities, close to Costco & hospitals.',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '5-de-diciembre',
    name: '5 de Diciembre',
    description: 'An authentic Mexican coastal neighborhood steeped in heritage. Steep cobblestone streets climb the hillside above Camarones Beach with sweeping bay vistas.',
    averagePriceUsd: 380000,
    vibe: 'Traditional Charm & Malecon Proximity',
    highlight: 'Playa Camarones, Mercado Municipal, panoramic sunset lookouts.',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80',
  },
];

export async function GET() {
  return NextResponse.json(NEIGHBORHOODS_DATA);
}
