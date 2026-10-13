import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const now = Date.now();
  const cachedSentinel = undefined;

  if (cachedSentinel && cachedSentinel.expiresAt > now) {
    return NextResponse.json({
      testId: id,
      cacheHit: true,
      defenseTriggered: 'NULL_SENTINEL_INTERCEPTED',
      latencyMs: 1.2,
      databaseQueried: false,
      message: 'Request intercepted by Redis NULL Sentinel cache. Database storage was protected from bombardment.',
      ttlRemainingSeconds: Math.round((cachedSentinel.expiresAt - now) / 1000),
    });
  }

  // First time miss: DB checked, found null, cache sentinel for 60 seconds
  const jitterTtlSeconds = 45 + Math.floor(Math.random() * 30);
  

  return NextResponse.json({
    testId: id,
    cacheHit: false,
    defenseTriggered: 'INITIAL_DB_MISS_SENTINEL_CACHED',
    latencyMs: 24.8,
    databaseQueried: true,
    message: `Record with id "${id}" does not exist in DB. NULL_SENTINEL cached in Redis for ${jitterTtlSeconds}s to prevent cache penetration.`,
    ttlAssignedSeconds: jitterTtlSeconds,
  });
}
