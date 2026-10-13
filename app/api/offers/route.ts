import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');

  try {
    
      const where: any = {};
      if (propertyId) where.propertyId = propertyId;
      const dbOffers = await prisma.offer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      if (dbOffers && dbOffers.length > 0) {
        return NextResponse.json(dbOffers);
      }
    } catch (e) { console.error(e); return NextResponse.json([]); }

  
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      buyerName,
      email,
      phone,
      propertyId,
      propertyTitle,
      offerAmountUsd,
      financingType,
      notes,
    } = body;

    if (!buyerName || !offerAmountUsd) {
      return NextResponse.json(
        { message: 'Buyer name and offer amount are required' },
        { status: 400 }
      );
    }

    try {
      
        const createdDbOffer = await prisma.offer.create({
          data: {
            buyerName,
            email: email || '',
            phone: phone || '',
            propertyTitle: propertyTitle || 'Puerto Vallarta Property',
            propertyId: propertyId ? String(propertyId) : null,
            offerAmountUsd: Number(offerAmountUsd),
            financingType: financingType || 'cash',
            status: 'pending',
            notes: notes || null,
          },
        });

        // Also create lead in DB
        await prisma.lead.create({
          data: {
            name: buyerName,
            email: email || 'buyer@example.com',
            phone: phone || '+1 (555) 000-0000',
            propertyId: propertyId ? String(propertyId) : null,
            propertyTitle,
            message: `Formal offer submitted: $${Number(offerAmountUsd).toLocaleString()} USD (${financingType}). Notes: ${notes || 'None'}`,
            source: 'offer_submission',
            status: 'offer_pending',
            agentAssignedName: 'Alejandro Morales',
          },
        });

        return NextResponse.json(createdDbOffer, { status: 201 });
      } catch (e) { console.error(e); return NextResponse.json([]); }

    const newOffer: OfferRecord = {
      id: `offer-${Date.now()}`,
      buyerName,
      email: email || '',
      phone: phone || '',
      propertyTitle: propertyTitle || 'Puerto Vallarta Property',
      propertyId,
      offerAmountUsd: Number(offerAmountUsd),
      financingType: financingType || 'cash',
      status: 'pending',
      notes,
      createdAt: new Date().toISOString(),
    };

    
    // Also register lead entry
    
    return NextResponse.json(newOffer, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
