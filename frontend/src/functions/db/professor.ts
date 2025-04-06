"use server";

import prisma from "@/functions/db"

export async function getAllProfessors() {
  const professors = await prisma.professor.findMany({
    include: {
      courses: true
    },
    orderBy: {
      name: "asc",
    }
  })
  return professors
}

export async function createProfessor(
  name: string,
  email: string
) {
  const professor = await prisma.professor.create({
    data: {
      name: name.trim(),
      email: email.trim()
    },
    include: {
      courses: true
    }
  })
  return professor
}
