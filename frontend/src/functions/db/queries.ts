"use server"

import prisma from "@/functions/db"
import { Course } from "@prisma/client"

export async function getAllCourses(): Promise<Course[]> {
  const courses = await prisma.course.findMany()
  return courses
}
