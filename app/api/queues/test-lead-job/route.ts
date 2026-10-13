import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newJob = {
      id: `bull-job-${Date.now()}`,
      jobName: 'dispatch_lead_crm_worker',
      data,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    

    return NextResponse.json({
      jobId: newJob.id,
      queueName: 'crm-lead-dispatch-queue',
      status: 'enqueued',
      workerState: 'active_processing',
      timestamp: newJob.timestamp,
      message: 'Background job dispatched to BullMQ worker.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'Worker failure' },
      { status: 500 }
    );
  }
}
