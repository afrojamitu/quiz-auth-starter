import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, email, testId, password } = await req.json();
    
    // Generate password if not provided
    const generatedPassword = password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'user'
        }
      });
    }
    
    // Create test taker assignment
    const testTaker = await prisma.testTaker.create({
      data: {
        userId: user.id,
        testId
      },
      include: {
        user: true,
        test: {
          include: {
            quiz: {
              include: {
                position: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json({ 
      testTaker, 
      credentials: { email, password: generatedPassword }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const testTakers = await prisma.testTaker.findMany({
      include: {
        user: true,
        test: {
          include: {
            quiz: {
              include: {
                position: true
              }
            }
          }
        },
        answers: true
      }
    });
    return NextResponse.json(testTakers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}