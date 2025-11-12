import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const tests = await prisma.test.findMany({
      include: {
        quiz: {
          include: {
            position: true
          }
        },
        testQuestions: {
          include: {
            question: {
              include: {
                options: true
              }
            }
          }
        },
        testTakers: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, testDate, duration, quizId, selectedQuestions } = await req.json();
    
    const test = await prisma.test.create({
      data: {
        name,
        testDate: new Date(testDate),
        duration: parseInt(duration),
        quizId,
        testQuestions: {
          create: selectedQuestions.map((questionId, index) => ({
            questionId,
            order: index + 1
          }))
        }
      },
      include: {
        testQuestions: {
          include: {
            question: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}