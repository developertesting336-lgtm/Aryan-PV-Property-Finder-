import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { slug }
    });
    if (!property) return NextResponse.json({error: 'Not found'}, {status: 404});
    return NextResponse.json(property);
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }
}