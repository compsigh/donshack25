import { NextResponse } from "next/server"
import { createCourse, getAllCourses } from "@/functions/db/course"

export async function GET() {
  try {
    const courses = await getAllCourses()
    return NextResponse.json(courses)
  }
  catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const {
      name,
      description,
      credits,
      subjectId,
      professorId,
      prerequisiteIds
    } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }
    if (typeof credits !== "number" || credits < 0) {
      return NextResponse.json({ error: "Valid credits number is required" }, { status: 400 })
    }
    if (!subjectId) {
      return NextResponse.json({ error: "Subject ID is required" }, { status: 400 })
    }
    if (!professorId) {
      return NextResponse.json({ error: "Professor ID is required" }, { status: 400 })
    }

    const course = await createCourse(
      name.trim(),
      description.trim(),
      credits,
      subjectId,
      professorId,
      prerequisiteIds
    )
    return NextResponse.json(course)
  }

  catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}
