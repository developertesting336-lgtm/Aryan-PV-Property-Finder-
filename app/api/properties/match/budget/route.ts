import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const budget = Number(searchParams.get('budget') || '500000');
  const propertyType = searchParams.get('propertyType');
  const oceanView = searchParams.get('oceanView');

  // Match properties within +/- 25% of budget
  const minTarget = budget * 0.75;
  const maxTarget = budget * 1.25;

  try {
    const where: any = {
      priceUsd: { gte: minTarget, lte: maxTarget }
    };
    if (propertyType && propertyType !== 'all') {
      where.propertyType = { equals: propertyType, mode: 'insensitive' };
    }
    if (oceanView === 'true') {
      where.oceanView = true;
    }
    const candidates = await prisma.property.findMany({
      where,
      take: 3,
      orderBy: { priceUsd: 'asc' }
    });
    return NextResponse.json(candidates);
  } catch (err) {
    console.error(err);
    return NextResponse.json([]);
  }
}