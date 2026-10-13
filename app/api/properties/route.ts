import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const propertyType = searchParams.get('propertyType');
  const neighborhood = searchParams.get('neighborhood');
  const oceanView = searchParams.get('oceanView');
  const search = searchParams.get('search')?.toLowerCase();

  try {
    const where: any = {};

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceUsd = {};
      if (minPrice !== undefined) where.priceUsd.gte = minPrice;
      if (maxPrice !== undefined) where.priceUsd.lte = maxPrice;
    }

    if (propertyType && propertyType.toLowerCase() !== 'all') {
      where.propertyType = { equals: propertyType, mode: 'insensitive' };
    }

    if (neighborhood && neighborhood.toLowerCase() !== 'all') {
      where.neighborhood = { equals: neighborhood, mode: 'insensitive' };
    }

    if (oceanView !== null && oceanView !== undefined) {
      where.oceanView = oceanView === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { neighborhood: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const dbResults = await prisma.property.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(dbResults);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json([]);
  }
}
