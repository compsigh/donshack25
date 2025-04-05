"use server";

import { Course } from '../../../generated/prisma';
import prisma from '.';

export async function getAllCourses(): Promise<Course[]> {
  const courses = await prisma.course.findMany();
  return courses;
}