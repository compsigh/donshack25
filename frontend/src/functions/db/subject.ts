import prisma from "@/functions/db"

export async function getAllSubjects() {
  const subjects = await prisma.subject.findMany({
    include: {
      courses: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return subjects
}

export async function createSubject(
  name: string,
  code: string
) {
  const subject = await prisma.subject.create({
    data: {
      name,
      code
    }, 
  })
  return subject
}
