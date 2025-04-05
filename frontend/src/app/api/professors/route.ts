import prisma from "@/functions/db"
import { NextResponse } from "next/server"
import { createProfessor, getAllProfessors } from "@/functions/db/professor"

export async function GET() {
  try {
    const professors = await getAllProfessors()
    return NextResponse.json(professors)
  }
  catch (error) {
    console.error("Error fetching professors:", error)
    return NextResponse.json(
      { error: "Failed to fetch professors" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email } = await request.json()

    if (!firstName?.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      )
    }
    if (!lastName?.trim()) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      )
    }
    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    const existingProfessor = await prisma.professor.findUnique({
      where: { email }
    })
    if (existingProfessor) {
      return NextResponse.json(existingProfessor);
    }

    const professor = await createProfessor(
      firstName.trim(),
      lastName.trim(),
      email.trim()
    )
    return NextResponse.json(professor)
  }

  catch (error) {
    console.error("Error creating professor:", error)
    return NextResponse.json(
      { error: "Failed to create professor" },
      { status: 500 }
    )
  }
}
