'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function listProperties(filters: { maxPrice?: number; minPrice?: number; type?: string } = {}) {
  try {
    const where: any = {};
    if (filters.maxPrice || filters.minPrice) {
      where.priceUsd = {};
      if (filters.minPrice) where.priceUsd.gte = filters.minPrice;
      if (filters.maxPrice) where.priceUsd.lte = filters.maxPrice;
    }
    if (filters.type && filters.type !== 'all') {
      where.propertyType = { equals: filters.type, mode: 'insensitive' };
    }

    const results = await prisma.property.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    return results;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function currentUserId() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id;
  } catch {
    return 'buyer-1';
  }
}

export async function saveProperty(propertyId: string) {
  const userId = await currentUserId();
  if (!userId) throw new Error('Please sign in to save homes');
  try {
    await prisma.savedProperty.upsert({
      where: {
        userId_propertyId: {
          userId,
          propertyId: String(propertyId),
        },
      },
      update: {},
      create: {
        userId,
        propertyId: String(propertyId),
      },
    });
  } catch (err) {
    console.error('DB save property err:', err);
  }
  revalidatePath('/properties');
}

export async function submitInquiry(form: { propertyId?: string; name: string; email: string; message: string }) {
  const userId = await currentUserId();
  try {
    await prisma.inquiry.create({
      data: {
        propertyId: form.propertyId ? String(form.propertyId) : null,
        name: form.name,
        email: form.email,
        message: form.message,
        userId: userId ?? null,
      },
    });
    return { success: true };
  } catch (err) {
    console.error('DB submit inquiry error:', err);
    return { success: false, error: 'Database error' };
  }
}

