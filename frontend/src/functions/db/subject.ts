"use server"

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

export async function createOrGetExistingSubject(name: string, code: string) {
  const existingSubject = await prisma.subject.findFirst({
    where: {
      name,
      code
    },
    include: {
      courses: true
    }
  })

  if (existingSubject?.name === name && existingSubject.code === code) {
    return existingSubject
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      code
    },
    include: {
      courses: true
    }
  })
  return subject
}
