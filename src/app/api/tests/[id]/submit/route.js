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
        status: 'in_progress'
      },
      include: {
        test: { 
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
        },
        answers: true
      }
    });

    if (!testTaker) {
      return NextResponse.json({ error: 'Test not found or already submitted' }, { status: 404 });
    }

    // Auto-grade MCQ questions
    let totalScore = 0;
    let gradedQuestions = 0;

    for (const answer of testTaker.answers) {
      const testQuestion = testTaker.test.testQuestions.find(tq => tq.id === answer.testQuestionId);
      const question = testQuestion?.question;
      
      if (question?.type === 'mcq') {
        const correctOptions = question.options
          .filter(o => o.isCorrect)
          .map(o => o.id)
          .sort();
        
        const selectedOptions = JSON.parse(answer.selectedOptions || '[]').sort();
        
        const isCorrect = correctOptions.length === selectedOptions.length &&
          correctOptions.every((id, index) => id === selectedOptions[index]);
        
        await prisma.answer.update({
          where: { id: answer.id },
          data: {
            isCorrect,
            score: isCorrect ? 1 : 0
          }
        });
        
        totalScore += isCorrect ? 1 : 0;
        gradedQuestions++;
      }
    }

    // Update test taker status
    await prisma.testTaker.update({
      where: { id: testTaker.id },
      data: {
        submittedAt: new Date(),
        status: 'submitted',
        score: gradedQuestions > 0 ? totalScore : null
      }
    });

    return NextResponse.json({ success: true, score: totalScore, gradedQuestions });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}