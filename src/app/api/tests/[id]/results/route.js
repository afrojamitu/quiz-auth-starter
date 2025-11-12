import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testTaker = await prisma.testTaker.findFirst({
      where: {
        testId: params.id,
        userId: session.user.id
      },
      include: {
        test: true,
        answers: {
          include: {
            testQuestion: {
              include: {
                question: {
                  include: {
                    options: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(testTaker);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}