"use server"

import prisma from "."

export async function test() {
  try {
    // 1. Ensure the referenced courses exist
    const resp = await prisma.course.createMany({
      data: [
        {
          id: 245,
          name: "Intro to Programming",
          subjectCode: "CS"
        },
        {
          id: 315,
          name: "Data Structures",
          subjectCode: "CS"
        },
        {
          id: 326,
          name: "Algorithms",
          subjectCode: "CS"
        }
      ],
      skipDuplicates: true
    })

    console.log("resps: ", resp)

    // 2. Create COURSE expression for 315
    const courseExpr315 = await prisma.expression.create({
      data: {
        type: "COURSE",
        course: { connect: { id: 315 } }
      }
    })

    // 3. Create COURSE expression for 326
    const courseExpr326 = await prisma.expression.create({
      data: {
        type: "COURSE",
        course: { connect: { id: 326 } }
      }
    })

    console.log("Course expression for 326 created:", courseExpr326)

    // 4. Create OR node with 315 and 326 as children
    const orExpr = await prisma.expression.create({
      data: {
        type: "OR",
        children: {
          connect: [{ id: courseExpr315.id }, { id: courseExpr326.id }]
        }
      }
    })

    console.log("OR expression created:", orExpr)

    // 5. Create COURSE expression for 245
    const courseExpr245 = await prisma.expression.create({
      data: {
        type: "COURSE",
        course: { connect: { id: 245 } }
      }
    })

    console.log("Course expression for 245 created:", courseExpr245)

    // 6. Create AND node with course 245 and the OR node as children
    const andExpr = await prisma.expression.create({
      data: {
        type: "AND",
        children: {
          connect: [{ id: courseExpr245.id }, { id: orExpr.id }]
        }
      }
    })

    console.log("AND expression created:", andExpr)

    // 7. Create a new course and link it to the AND expression as its prerequisite
    const newCourse = await prisma.course.create({
      data: {
        name: "490",
        subjectCode: "CS",
        prerequisitesId: andExpr.id
      }
    })

    console.log("new course created:", newCourse)
    return newCourse
  } catch (error) {
    console.error("Error creating test data:", error)
  }
}

export async function recursiveQuery(expressionId: number) {
  const recursiveInclude = (depth: number = 5): any => {
    if (depth <= 0) return true
    return {
      course: true,
      children: {
        include: {
          course: true,
          ...recursiveInclude(depth - 1)
        }
      }
    }
  }

  const resp = await prisma.expression.findUnique({
    where: { id: expressionId },
    include: recursiveInclude()
  })

  console.log("Response: ", JSON.stringify(resp, null, 2))
  return resp
}
