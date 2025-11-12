import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      include: { 
        quizzes: {
          include: {
            groups: {
              include: {
                questions: true
              }
            }
          }
        } 
      }
    });
    return NextResponse.json(positions);
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
    
    const data = await req.json();
    const position = await prisma.position.create({ data });
    return NextResponse.json(position);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}