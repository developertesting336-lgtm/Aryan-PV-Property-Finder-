import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Puerto Vallarta real estate database to PostgreSQL...');

  // Create demo agent / user
  const agent = await prisma.user.upsert({
    where: { email: 'alejandro@pvproperties.mx' },
    update: {},
    create: {
      name: 'Alejandro Morales',
      email: 'alejandro@pvproperties.mx',
      role: 'agent',
      emailVerified: true,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log(`Agent created: ${agent.name}`);

  // Seed sample properties
  const propertiesData = [
    {
      slug: 'residencias-los-muertos-beachfront-penthouse',
      title: 'Residencias Los Muertos Beachfront Penthouse',
      location: 'Calle Amapas 142, Zona Romántica, Puerto Vallarta',
      neighborhood: 'Zona Romántica',
      priceUsd: 875000,
      bedrooms: 3,
      bathrooms: 3.5,
      sqft: 2200,
      propertyType: 'Penthouse',
      oceanView: true,
      beachfront: true,
      pool: true,
      featured: true,
      description:
        'Stunning luxury residence overlooking Banderas Bay with wrap-around sunset terraces, private plunge pool, and direct access to Los Muertos beachfront dining.',
      address: 'Calle Amapas 142, Zona Romántica',
      amenities: ['Oceanfront Terrace', 'Infinity Pool', '24/7 Security', 'Covered Parking', 'Elevator', 'Chef Kitchen'],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'villa-playa-conchas-chinas',
      title: 'Villa Miramar Conchas Chinas',
      location: 'Paseo de las Conchas Chinas 88',
      neighborhood: 'Conchas Chinas',
      priceUsd: 1450000,
      bedrooms: 4,
      bathrooms: 4.5,
      sqft: 3800,
      propertyType: 'Villa',
      oceanView: true,
      beachfront: false,
      pool: true,
      featured: true,
      description:
        'Dramatic cliffside estate with cantilevered infinity pool overlooking Pacific sunset corridors, travertine terraces, and Parota wood finishes.',
      address: 'Paseo de las Conchas Chinas 88',
      amenities: ['Infinity Pool', 'Wine Cellar', 'Staff Quarters', 'Gated Security', 'Solar Array'],
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'marina-golf-and-yacht-condo',
      title: 'Marina Vallarta Harborview Residence',
      location: 'Paseo de la Marina 240',
      neighborhood: 'Marina Vallarta',
      priceUsd: 495000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1550,
      propertyType: 'Condo',
      oceanView: false,
      beachfront: false,
      pool: true,
      featured: false,
      description:
        'Elegant harbor-side condominium overlooking luxury yachts, steps from 18-hole championship golf course and boardwalk restaurants.',
      address: 'Paseo de la Marina 240, Marina Vallarta',
      amenities: ['Boat Slip Access', 'Tennis Courts', 'Heated Pool', 'Gym', 'Covered Parking'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      slug: 'versalles-culinary-corridor-loft',
      title: 'Versalles Gastronomy Loft',
      location: 'Calle España 310, Versalles',
      neighborhood: 'Versalles',
      priceUsd: 295000,
      bedrooms: 1,
      bathrooms: 1.5,
      sqft: 850,
      propertyType: 'Studio',
      oceanView: false,
      beachfront: false,
      pool: true,
      featured: false,
      description:
        'High-yielding investment loft in the culinary capital of Puerto Vallarta. Walking distance to acclaimed micro-roasters and French bistros.',
      address: 'Calle España 310, Versalles',
      amenities: ['Rooftop Deck', 'Plunge Pool', 'Coworking Lounge', 'Keyless Entry'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      ],
    },
  ];

  for (const p of propertiesData) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log(`Seeded ${propertiesData.length} properties.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
