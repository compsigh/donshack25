import { NextResponse } from "next/server"
import { createSubject, getAllSubjects } from "@/functions/db/subject"

export async function GET(request: Request) {
  try {
    const subjects = await getAllSubjects()
    return NextResponse.json(subjects)
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
    const { name, code } = await request.json()

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      )
    }

    const subject = createSubject(name, code)
    return NextResponse.json(subject)
  }

  catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    )
  }
}
