import { NextResponse } from "next/server"
import { getAllSubjects, getOrCreateSubject } from "@/functions/db/subject"

export async function GET() {
  try {
    const subjects = await getAllSubjects()
    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { code, name } = await request.json()

    if (!code || !name) {
      return NextResponse.json(
        { error: "Subject code and name are required" },
        { status: 400 }
      )
    }

    const subject = await getOrCreateSubject(code, name)
    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    )
  }
}
