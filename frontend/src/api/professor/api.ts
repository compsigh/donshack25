import { NextResponse } from 'next/server';
import prisma from '@/functions/db';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email } = await request.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    const professor = await prisma.professor.create({
      data: {
        firstName,
        lastName,
        email,
      },
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