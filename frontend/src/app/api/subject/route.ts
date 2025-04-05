import { NextResponse } from 'next/server';
import prisma from '@/functions/db';

export async function POST(request: Request) {
  try {
    const { name, code } = await request.json();

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  console.log("request", request);
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        courses: true
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching professors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch professors' },
      { status: 500 }
    );
  }
}