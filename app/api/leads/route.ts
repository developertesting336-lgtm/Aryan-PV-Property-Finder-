import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    
      const where: any = {};
      if (status && status !== 'all') where.status = status;
      const dbLeads = await prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      if (dbLeads && dbLeads.length > 0) {
        return NextResponse.json(dbLeads);
      }
    } catch (e) { console.error(e); return NextResponse.json([]); }

  
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, propertyId, propertyTitle, message, source } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Try PostgreSQL Prisma insertion
    try {
      
        // Upsert contact
        await prisma.contact.upsert({
          where: { email: email.toLowerCase() },
          update: { phone: phone || undefined, name },
          create: { name, email: email.toLowerCase(), phone: phone || null },
        });

        // Create Lead
        const createdDbLead = await prisma.lead.create({
          data: {
            name,
            email: email.toLowerCase(),
            phone: phone || '+52 322 100 0000',
            propertyId: propertyId ? String(propertyId) : null,
            propertyTitle: propertyTitle || 'General PV Inquiry',
            message: message || '',
            source: source || 'web_form',
            status: 'new',
            agentAssignedName: 'Alejandro Morales',
          },
        });

        // Also add to Bloom Filter set
        mockDb.bloomFilterBitset.add(email.toLowerCase());
        if (phone) mockDb.bloomFilterBitset.add(phone);

        return NextResponse.json(createdDbLead, { status: 201 });
      } catch (e) { console.error(e); return NextResponse.json([]); }

      } catch (e) { console.error(e); return NextResponse.json({error: 'DB Error'}, {status: 500}); }
}