"use server";

import prisma from "@/functions/db";
import { Course } from "@prisma/client";

export async function getAllCourses() {
  const courses = await prisma.course.findMany({
    include: {
      subject: true,
      professor: true,
      prerequisite: true,
      prerequisiteOf: true,
    },
  });
  return courses;
}

// TODO: Add support for prerequisite and prerequisiteOf
export async function createCourse(
  name: string,
  description: string,
  credits: number,
  subjectId: number,
  professorId: number,
  prerequisiteIds: number[],
  prerequisiteForIds: number[]
): Promise<Course> {
  const course = await prisma.course.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      credits,
      subject: {
        connect: {
          id: subjectId,
        },
      },
      professor: {
        connect: {
          id: professorId,
        },
      },
      ...(prerequisiteIds?.length
        ? {
            prerequisite: {
              connect: prerequisiteIds.map((id) => ({ id })),
            },
          }
        : {}),
      ...(prerequisiteForIds?.length
        ? {
            prerequisiteOf: {
              connect: prerequisiteForIds.map((id) => ({ id })),
            },
          }
        : {}),
    },
    include: {
      subject: true,
      professor: true,
      prerequisite: true,
      prerequisiteOf: true,
    },
  });
  return course;
}

export async function updateCourse(
  id: number,
  name: string,
  description: string,
  credits: number,
  subjectId: number,
  professorId: number,
  prerequisiteIds: number[],
  prerequisiteForIds: number[],
): Promise<Course> {
  // First disconnect existing relationships if new IDs are provided
  if (prerequisiteIds || prerequisiteForIds) {
    await prisma.course.update({
      where: { id },
      data: {
        ...(prerequisiteIds
          ? {
              Prerequisites: {
                set: [],
              },
            }
          : {}),
        ...(prerequisiteForIds
          ? {
              prerequisiteOf: {
                set: [],
              },
            }
          : {}),
      },
    });
  }

  // Update the course with new data
  const updatedCourse = await prisma.course.update({
    where: { id },
    data: {
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      ...(credits && { credits }),
      ...(subjectId && { subjectId }),
      ...(professorId && { professorId }),
      ...(prerequisiteIds?.length
        ? {
            Prerequisites: {
              connect: prerequisiteIds.map((id) => ({ id })),
            },
          }
        : {}),
      ...(prerequisiteForIds?.length
        ? {
            prerequisiteOf: {
              connect: prerequisiteForIds.map((id) => ({ id })),
            },
          }
        : {}),
    },
    include: {
      subject: true,
      professor: true,
      prerequisite: true,
      prerequisiteOf: true,
    },
  });

  return updatedCourse;
}
