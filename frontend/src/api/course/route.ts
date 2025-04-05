import { NextResponse } from 'next/server';
import prisma from '@/functions/db';

export async function POST(request: Request) {
  try {
    const { 
      name, 
      description, 
      credits, 
      subjectId, 
      professorId, 
      prerequisiteIds 
    } = await request.json();

    if (!name || !description || !credits || !subjectId || !professorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        name,
        description,
        credits,
        subjectId,
        professorId,
        prerequisites: prerequisiteIds ? {
          create: prerequisiteIds.map((prereqId: string) => ({
            prerequisiteId: prereqId
          }))
        } : undefined
      },
      include: {
        subject: true,
        professor: true,
        prerequisites: {
          include: {
            prerequisite: true
          }
        }
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}