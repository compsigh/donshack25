"use server"

import prisma from "@/functions/db"
import { Course } from "@prisma/client"

export async function postCourse(
  name: string,
  description: string,
  credits: number,
  subjectId: number,
  professorId: number,
  prerequisiteIds?: number[]
): Promise<Course> {
  const course = await prisma.course.create({
    data: {
      name,
      description,
      credits,
      subjectId,
      professorId,
      prerequisites: prerequisiteIds ? {
        create: prerequisiteIds.map(prereqId => ({
          prerequisiteId: prereqId
        }))
      } : undefined
    },
    include: {
      subject: true,
      professor: true,
      prerequisites: {
        include: {
          prerequisite: true
        }
      }
    }
  })
  return course
}
