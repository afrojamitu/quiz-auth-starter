import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        quiz: {
          include: {
            position: true
          }
        },
        testQuestions: {
          include: {
            question: true
          }
        }
      }
    });

    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}