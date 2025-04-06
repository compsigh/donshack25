"use server"

import prisma from "@/functions/db"

export async function getAllSubjects() {
  const subjects = await prisma.subject.findMany({
    include: {
      courses: true
    },
    orderBy: {
      name: "asc"
    }
  })
  return subjects
}

export async function getOrCreateSubject(code: string, name: string) {
  const existingSubject = await prisma.subject.findFirst({
    where: {
      name,
      code
    },
    include: {
      courses: true
    }
  })

  if (existingSubject) {
    return existingSubject
  }

  const subject = await prisma.subject.create({
    data: {
      code,
      name
    },
    include: {
      courses: true
    }
  })
  return subject
}
