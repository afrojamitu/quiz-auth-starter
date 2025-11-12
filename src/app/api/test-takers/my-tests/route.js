import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testTakers = await prisma.testTaker.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        test: {
          include: {
            quiz: {
              include: {
                position: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(testTakers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}