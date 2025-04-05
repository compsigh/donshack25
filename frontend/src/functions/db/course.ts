import prisma from "@/functions/db"

export async function getAllCourses() {
  const courses = await prisma.course.findMany({
    include: {
      subject: true,
      professor: true,
      prerequisites: true,
      isPrerequisiteFor: true
    }
  })
  return courses
}

export async function createCourse(
  name: string,
  description: string,
  credits: number,
  subjectId: number,
  professorId: number,
  prerequisiteIds?: number[]
) {
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
      prerequisites: {
        connect: prerequisiteIds ? prerequisiteIds.map(id => ({ id })) : []
      }
    },
    include: {
      subject: true,
      professor: true,
      prerequisites: true,
      isPrerequisiteFor: true
    }
  })
  return course
}
