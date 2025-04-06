"use server";

import prisma from "@/functions/db";

export async function getUserByEmailOrCreate(email: string, name: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        coursesTaken: true,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
