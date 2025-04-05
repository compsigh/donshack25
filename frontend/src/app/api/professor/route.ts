import { NextResponse } from 'next/server';
import prisma from '@/functions/db';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email } = await request.json();

    // Basic validation
    if (!firstName?.trim()) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }

    if (!lastName?.trim()) {
      return NextResponse.json(
        { error: 'Last name is required' },
        { status: 400 }
      );
    }

    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check for existing professor
    const existingProfessor = await prisma.professor.findUnique({
      where: { email }
    });

    if (existingProfessor) {
      return NextResponse.json(
        { error: 'Professor with this email already exists' },
        { status: 409 }
      );
    }

    // Create professor
    const professor = await prisma.professor.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim()
      },
      include: {
        courses: true
      }
    });

    return NextResponse.json(professor);
  } catch (error) {
    console.error('Error creating professor:', error);
    return NextResponse.json(
      { error: 'Failed to create professor' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  console.log("request", request);
  try {
    const professors = await prisma.professor.findMany({
      include: {
        courses: true
      },
      orderBy: {
        lastName: 'asc'
      }
    });

    return NextResponse.json(professors);
  } catch (error) {
    console.error('Error fetching professors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch professors' },
      { status: 500 }
    );
  }
}