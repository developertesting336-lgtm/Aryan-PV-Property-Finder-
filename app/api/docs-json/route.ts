import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    openapi: '3.0.0',
    info: {
      title: 'PV Property Finder Full-Stack REST API',
      description: 'API engine for Puerto Vallarta real estate listings, 3D showcases, CRM leads, offers, and algorithmic valuations.',
      version: '1.0.0',
    },
    servers: [{ url: '/api', description: 'Next.js Full-Stack App Router' }],
    paths: {
      '/properties': {
        get: { summary: 'List properties with filters (price, type, neighborhood, oceanView)' },
      },
      '/properties/{slug}': {
        get: { summary: 'Retrieve property detail and media gallery' },
      },
      '/neighborhoods': {
        get: { summary: 'List Puerto Vallarta neighborhoods and average comps' },
      },
      '/leads': {
        get: { summary: 'Get CRM inbound leads' },
        post: { summary: 'Submit buyer lead or walkthrough request' },
      },
      '/offers': {
        get: { summary: 'List purchase offers' },
        post: { summary: 'Draft and transmit formal purchase offer' },
      },
      '/valuations': {
        get: { summary: 'List seller valuations' },
        post: { summary: 'Calculate algorithmic market comps valuation' },
      },
      '/quiz/score': {
        post: { summary: 'Score lifestyle and budget matching quiz' },
      },
      '/redis/bloom-check': {
        get: { summary: 'Check Bloom Filter membership with zero false negatives' },
      },
    },
  });
}
