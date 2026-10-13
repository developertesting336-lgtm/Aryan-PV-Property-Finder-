import { NextResponse } from 'next/server';


export async function GET() {
  return NextResponse.json({
    isRedisConnected: true,
    engine: 'BullMQ 5.0 (Redis Stream Workers)',
    leadQueue: {
      waiting: 0,
      active: 1,
      completed: 0,
      failed: 0,
      delayed: 0,
    },
    valuationQueue: {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
    },
    recentJobs: [],
  });
}
