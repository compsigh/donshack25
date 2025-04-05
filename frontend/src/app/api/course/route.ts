import { NextResponse } from "next/server"
import prisma from "@/functions/db"

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

    // Basic validation
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

    // Create course with prerequisites if provided
    const course = await prisma.course.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        credits,
        subjectId,
        professorId,
        ...(prerequisiteIds?.length ? {
          prerequisites: {
            create: prerequisiteIds.map((prereqId: string) => ({
              prerequisiteId: prereqId,
            }))
          }
        } : {})
      },
      include: {
        subject: true,
        professor: true,
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        isPrerequisiteFor: {
          include: {
            course: true
          }
        }
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  console.log("request", request)
  try {
    const courses = await prisma.course.findMany({
      include: {
        subject: true,
        professor: true,
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        isPrerequisiteFor: {
          include: {
            course: true
          }
        }
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}
