import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    
      const dbVals = await prisma.valuation.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (dbVals && dbVals.length > 0) {
        return NextResponse.json(dbVals);
      }
    } catch (e) { console.error(e); return NextResponse.json([]); }
  
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ownerName,
      email,
      phone,
      neighborhood,
      propertyType,
      bedrooms,
      bathrooms,
      sqft,
      condition,
      oceanView,
    } = body;

    if (!ownerName || !email || !sqft) {
      return NextResponse.json(
        { message: 'Owner name, email, and sqft are required' },
        { status: 400 }
      );
    }

    // Neighborhood benchmark pricing table ($USD/sqft)
    const neighborhoodBasePrice: Record<string, number> = {
      'conchas chinas': 450,
      'zona romántica': 390,
      'amapas': 360,
      'marina vallarta': 320,
      'fluvial vallarta': 280,
      'versalles': 270,
      '5 de diciembre': 290,
    };

    const normNeigh = (neighborhood || '').toLowerCase();
    const baseSqftPrice = neighborhoodBasePrice[normNeigh] || 320;

    // Condition multiplier
    let conditionMultiplier = 1.0;
    if (condition === 'luxury_remodel') conditionMultiplier = 1.22;
    else if (condition === 'excellent') conditionMultiplier = 1.12;
    else if (condition === 'needs_work') conditionMultiplier = 0.88;

    // Ocean view bump
    const oceanMultiplier = oceanView ? 1.25 : 1.0;

    const pricePerSqft = Math.round(baseSqftPrice * conditionMultiplier * oceanMultiplier);
    const midValue = Math.round(sqft * pricePerSqft);
    const lowValue = Math.round(midValue * 0.93);
    const highValue = Math.round(midValue * 1.08);

    try {
      
        const createdDbValuation = await prisma.valuation.create({
          data: {
            ownerName,
            email,
            phone: phone || null,
            neighborhood: neighborhood || 'Zona Romántica',
            propertyType: propertyType || 'condo',
            bedrooms: Number(bedrooms || 2),
            bathrooms: Number(bathrooms || 2),
            sqft: Number(sqft),
            condition: condition || 'excellent',
            oceanView: Boolean(oceanView),
            estimatedValueLowUsd: lowValue,
            estimatedValueMidUsd: midValue,
            estimatedValueHighUsd: highValue,
            pricePerSqftUsd: pricePerSqft,
          },
        });

        // Also add lead to DB
        await prisma.lead.create({
          data: {
            name: ownerName,
            email,
            phone: phone || '',
            propertyTitle: `Seller CMA: ${neighborhood} (${sqft} sqft)`,
            message: `Seller valuation benchmark: $${midValue.toLocaleString()} USD.`,
            source: 'valuation_calculator',
            status: 'new',
            agentAssignedName: 'Alejandro Morales',
          },
        });

        return NextResponse.json(createdDbValuation, { status: 201 });
      } catch (e) { console.error(e); return NextResponse.json([]); }

    const record: ValuationRecord = {
      id: `val-${Date.now()}`,
      ownerName,
      email,
      phone: phone || '',
      neighborhood: neighborhood || 'Zona Romántica',
      propertyType: propertyType || 'condo',
      bedrooms: Number(bedrooms || 2),
      bathrooms: Number(bathrooms || 2),
      sqft: Number(sqft),
      condition: condition || 'excellent',
      oceanView: Boolean(oceanView),
      estimatedValueLowUsd: lowValue,
      estimatedValueMidUsd: midValue,
      estimatedValueHighUsd: highValue,
      pricePerSqftUsd: pricePerSqft,
      createdAt: new Date().toISOString(),
    };

    
    // Also register lead for seller CRM
    
    return NextResponse.json(record, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
