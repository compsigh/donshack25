import prisma from "@/functions/db"

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
