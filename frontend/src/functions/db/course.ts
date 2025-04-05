import prisma from "@/functions/db"
import { Course } from "@prisma/client"

export async function getAllCourses() {
  const courses = await prisma.course.findMany({
    include: {
      subject: true,
      professor: true,
      Course_A: true,
      Course_B: true,
    }
  })
  return courses
}

// TODO: Add support for Course_A and Course_B
export async function createCourse(
  name: string,
  description: string,
  credits: number,
  subjectId: number,
  professorId: number,
  courseAIds: number[],
  courseBIds: number[],
): Promise<Course> {
  const course = await prisma.course.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      credits,
      subject: {
        connect: {
          id: subjectId
        }
      },
      professor: {
        connect: {
          id: professorId
        }
      },
      ...(courseAIds?.length ? {
        Course_A: {
          connect: courseAIds.map(id => ({ id }))
        }
      } : {}),
      ...(courseBIds?.length ? {
        Course_B: {
          connect: courseBIds.map(id => ({ id }))
        }
      } : {})
    },
    include: {
      subject: true,
      professor: true,
      Course_A: true,
      Course_B: true,
    }
  })
  return course
}

export async function updateCourse(
  id: number,
  name: string,
  description: string,
  credits: number,
  subjectId: number,
  professorId: number,
  courseAIds: number[],
  courseBIds: number[],
): Promise<Course> {
  // First disconnect existing relationships if new IDs are provided
  if (courseAIds || courseBIds) {
    await prisma.course.update({
      where: { id },
      data: {
        ...(courseAIds ? {
          Course_A: {
            set: [] // Clear existing Course_A relationships
          }
        } : {}),
        ...(courseBIds ? {
          Course_B: {
            set: [] // Clear existing Course_B relationships
          }
        } : {})
      }
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
      ...(courseAIds?.length ? {
        Course_A: {
          connect: courseAIds.map(id => ({ id }))
        }
      } : {}),
      ...(courseBIds?.length ? {
        Course_B: {
          connect: courseBIds.map(id => ({ id }))
        }
      } : {})
    },
    include: {
      subject: true,
      professor: true,
      Course_A: true,
      Course_B: true
    }
  });

  return updatedCourse
}
