import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const positionId = searchParams.get('positionId');
    
    const quizzes = await prisma.quiz.findMany({
      where: positionId ? { positionId } : {},
      include: {
        position: true,
        groups: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });
    return NextResponse.json(quizzes);
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
    
    const { title, description, positionId, groups } = await req.json();
    
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        positionId,
        groups: {
          create: groups.map(group => ({
            name: group.name,
            description: group.description,
            questions: {
              create: group.questions.map(question => ({
                text: question.text,
                type: question.type,
                options: question.type === 'mcq' ? {
                  create: question.options.map(option => ({
                    text: option.text,
                    isCorrect: option.isCorrect
                  }))
                } : undefined
              }))
            }
          }))
        }
      },
      include: {
        groups: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}