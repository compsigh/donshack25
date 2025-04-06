"use server"

import prisma from "@/functions/db"
import { Course } from "@prisma/client"

export async function getAllCourses() {
  const courses = await prisma.course.findMany({
    include: {
      subject: true,
      prerequisites: true,
      Expression: true
    }
  })
  return courses
}

export async function createOrGetExistingCourse(
  id: string,
  title: string,
  subjectCode: string,
  prerequisites: string[]
): Promise<Course> {
  const existingCourse = await prisma.course.findFirst({
    where: { id },
    include: {
      subject: true,
      prerequisites: true,
      Expression: true
    }
  })

  if (existingCourse) {
    return existingCourse
  }

  const course = await prisma.course.create({
    data: {
      id,
      title: title.trim(),
      subject: {
        connect: {
          code: subjectCode
        }
      }
    },
    include: {
      subject: true,
      prerequisites: true,
      Expression: true
    }
  })
  return course
}

export async function updateCourse(
  id: string,
  title: string,
  subjectCode: string,
  prerequisiteIds: number[],
  prerequisiteForIds: number[]
): Promise<Course> {
  const updatedCourse = await prisma.course.update({
    where: { id },
    data: {
      ...(title && { title: title.trim() }),
      ...(subjectCode && { subjectCode }),
      ...(prerequisiteIds?.length
        ? {
            Prerequisites: {
              connect: prerequisiteIds.map((id) => ({ id }))
            }
          }
        : {}),
      ...(prerequisiteForIds?.length
        ? {
            prerequisiteOf: {
              connect: prerequisiteForIds.map((id) => ({ id }))
            }
          }
        : {})
    },
    include: {
      subject: true,
      prerequisites: true,
      Expression: true
    }
  })

  return updatedCourse
}
