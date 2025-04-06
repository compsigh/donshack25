"use server";

import prisma from "@/functions/db"

export async function getAllProfessors() {
  const professors = await prisma.professor.findMany({
    include: {
      courses: true
    },
    orderBy: {
      lastName: "asc"
    }
  })
  return professors
}

export async function createProfessor(
  firstName: string,
  lastName: string,
  email: string
) {
  const professor = await prisma.professor.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim()
    },
    include: {
      courses: true
    }
  })
  return professor
}
