import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, counterNotes } = body;

  try {
    const updated = await prisma.offer.update({
      where: { id },
      data: { status, sellerNotes: counterNotes },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'DB Error'}, {status: 500});
  }
}