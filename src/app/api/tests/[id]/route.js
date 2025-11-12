import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testTaker = await prisma.testTaker.findFirst({
      where: {
        testId: params.id,
        userId: session.user.id,
        status: 'pending'
      }
    });

    if (!testTaker) {
      return NextResponse.json({ error: 'Test not found or already started' }, { status: 404 });
    }

    const updated = await prisma.testTaker.update({
      where: { id: testTaker.id },
      data: {
        status: 'in_progress',
        startedAt: new Date()
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}