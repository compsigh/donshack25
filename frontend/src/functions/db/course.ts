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
  name: string,
  subjectCode: string,
  prerequisiteIds: number[],
  prerequisiteForIds: number[]
): Promise<Course> {
  const existingCourse = await prisma.course.findFirst({
    where: {
      name,
      subjectCode
    },
    include: {
      subject: true,
      prerequisites: true,
      Expression: true
    }
  })

  // If it exists already.... return it
  if (
    existingCourse?.name === name &&
    existingCourse.subjectCode === subjectCode
  ) {
    return existingCourse
  }

  const course = await prisma.course.create({
    data: {
      name: name.trim(),
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
  id: number,
  name: string,
  subjectCode: string,
  prerequisiteIds: number[],
  prerequisiteForIds: number[]
): Promise<Course> {
  // First disconnect existing relationships if new IDs are provided
  // if (prerequisiteIds || prerequisiteForIds) {
  //   await prisma.course.update({
  //     where: { id },
  //     data: {
  //       ...(prerequisiteIds
  //         ? {
  //             Prerequisites: {
  //               set: [],
  //             },
  //           }
  //         : {}),
  //       ...(prerequisiteForIds
  //         ? {
  //             prerequisiteOf: {
  //               set: [],
  //             },
  //           }
  //         : {}),
  //     },
  //   })
  // }

  // Update the course with new data
  const updatedCourse = await prisma.course.update({
    where: { id },
    data: {
      ...(name && { name: name.trim() }),
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
