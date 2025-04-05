"use server";

import { PrismaClient } from '@prisma/client'
import { Course } from '../../../generated/prisma';

const prisma = new PrismaClient()

export async function getAllCourses(): Promise<Course[]> {
  const courses = await prisma.course.findMany();
  return courses;
}