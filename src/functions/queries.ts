"use server";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getAllCourses() {
  const courses = await prisma.course.findMany();
  return courses;
}