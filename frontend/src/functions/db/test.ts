"use server"

import prisma from "."


export async function test() {
  try {
    const subjectCode = "ELCS";
    const resp = await prisma.course.createMany({
      data: [
        // Lower Division Courses
        {
          id: "CS110",
          title: "Intro to Computer Science I",
          subjectCode: subjectCode,
        },
        {
          id: "CS111",
          title: "Foundations of Program Design",
          subjectCode: subjectCode,
        },
        {
          id: "CS112",
          title: "Intro to Computer Science II",
          subjectCode: subjectCode,
        },
        {
          id: "CS272",
          title: "Software Development",
          subjectCode: subjectCode,
        },
        {
          id: "CS272L",
          title: "Software Development Lab",
          subjectCode: subjectCode,
        },
        {
          id: "CS220",
          title: "Intro to Parallel Computing",
          subjectCode: subjectCode,
        },
        {
          id: "CS221",
          title: "C and Systems Programming",
          subjectCode: subjectCode,
        },
        {
          id: "CS245",
          title: "Data Struct & Algorithms",
          subjectCode: subjectCode,
        },
        
        // Upper Division Courses - Systems Area
        {
          id: "CS315",
          title: "Computer Architecture",
          subjectCode: subjectCode,
        },
        {
          id: "CS326",
          title: "Operating Systems",
          subjectCode: subjectCode,
        },
        {
          id: "CS336",
          title: "Computer Networks",
          subjectCode: subjectCode,
        },
        
        // Upper Division Courses - Theory and Languages Area
        {
          id: "CS345",
          title: "Prog Language Paradigms",
          subjectCode: subjectCode,
        },
        {
          id: "CS362",
          title: "Foundations of AI",
          subjectCode: subjectCode,
        },
        {
          id: "CS411",
          title: "Automata Theory",
          subjectCode: subjectCode,
        },
        {
          id: "CS414",
          title: "Compilers",
          subjectCode: subjectCode,
        },

        // Applications Area
        {
          id: "CS333",
          title: "Intro to Database Systems",
          subjectCode: subjectCode,
        },
        {
          id: "CS360",
          title: "Data Visualization",
          subjectCode: subjectCode,
        },
        {
          id: "CS384",
          title: "Research Seminar in CS",
          subjectCode: subjectCode,
        },
        {
          id: "CS385",
          title: "Special Lecture Series in CS",
          subjectCode: subjectCode,
        },
        {
          id: "CS386",
          title: "Sp Topics in Computer Sci",
          subjectCode: subjectCode,
        },
        {
          id: "CS419",
          title: "Computer Graphics",
          subjectCode: subjectCode,
        },
        {
          id: "CS420",
          title: "Game Engineering",
          subjectCode: subjectCode,
        },
        {
          id: "CS451",
          title: "Data Mining",
          subjectCode: subjectCode,
        },
        {
          id: "CS462",
          title: "Intro to AI",
          subjectCode: subjectCode,
        },
        {
          id: "CS463",
          title: "Machine Learning",
          subjectCode: subjectCode,
        },
        {
          id: "CS486",
          title: "Special Topics in Computer Sci",
          subjectCode: subjectCode,
        },
        {
          id: "CS490",
          title: "Senior Team Project",
          subjectCode: subjectCode,
        },
        {
          id: "MATH109",
          title: "Calculus & Analytic Geometry I",
          subjectCode: "MATH",
        },
        {
          id: "MATH201",
          title: "Discrete Mathematics",
          subjectCode: "MATH",
        },
        {
          id: "MATH202",
          title: "Linear Algebra & Proabability",
          subjectCode: "MATH",
        },
      ],
      skipDuplicates: true,
    });

    console.log("Coursess: ", resp);

    const courses = await prisma.course.findMany();
    const filteredCourses = courses.filter(course => {
      // Keep all MATH courses
      if (course.subjectCode === "MATH") return true;
      
      // Filter out CS courses with IDs starting with "CS3" or "CS4"
      return !(course.id.startsWith("CS3") || course.id.startsWith("CS4"));
    });

    console.log("Filtered Courses: ", filteredCourses);

    // Create all the expressions
    const expMap = new Map();
    const expressions = await prisma.expression.findMany();
    expressions.forEach(exp => {
      expMap.set(exp.courseId, exp);
    });

    console.log("expMap: ", expMap);

    // Update the course prerequisites
    // CS 110 -> CS 111
    await prisma.course.update({
      data: {
        id: "CS111",
        prerequisitesId: expMap.get("CS110").id,
      },
      where: { id: "CS111" },
    });

    // CS 110 -> CS 112
    await prisma.course.update({
      data: {
        id: "CS112",
        prerequisitesId: expMap.get("CS110").id,
      },
      where: { id: "CS112" },
    });

    // create an or exp for CS 110 + CS 111
    await prisma.expression.create({
      data: {
      type: "OR",
        children: {
          connect: [{ id: expMap.get("CS111").id }, { id: expMap.get("CS112").id }],
        } 
      }
    });

    // create the or for CS 110 + CS 111 + CS 112
    const orExp1 = await prisma.expression.create({
      data: {
        type: "OR",
        children: {
          connect: [
            { id: expMap.get("CS110").id },
            { id: expMap.get("CS111").id },
            { id: expMap.get("CS112").id }
          ],
        }
      }
    });

    // create the and for MATH 109 AND (CS 110 OR CS 111 OR CS 112)
    const andExp1 = await prisma.expression.create({
      data: {
        type: "AND",
        children: {
          connect: [
            { id: expMap.get("MATH109").id },
            { id: orExp1.id }
          ],
        }
      }
    });

    // create the prerqs for MATH 201
    await prisma.course.update({
      data: {
        id: "MATH201",
        prerequisitesId: andExp1.id,
      },
      where: { id: "MATH201" },
    });

    // create the prereq for Math 202
    await prisma.course.update({
      data: {
        id: "MATH202",
        prerequisitesId: expMap.get("MATH201").id,
      },
      where: { id: "MATH202" },
    });

    // create AND for CS 112 + MATH 201
    const andExpr2 = await prisma.expression.create({
      data: {
        type: "AND",
        children: {
          connect: [{ id: expMap.get("CS112").id }, { id: expMap.get("MATH201").id }],
        }
      }
    });

    // create the prereqs for CS 245
    await prisma.course.update({
      data: {
        id: "CS245",
        prerequisitesId: andExpr2.id,
      },
      where: { id: "CS245" },
    });

    // create the prereq for CS 272
    await prisma.course.update({
      data: {
        id: "CS272",
        prerequisitesId: expMap.get("CS245").id,
      },
      where: { id: "CS272" },
    });

    // Create the co-req for CS 272L
    await prisma.expression.create({
      data: {
        type: "AND",
        children: {
          connect: [{ id: expMap.get("CS272").id }, { id: expMap.get("CS272L").id }],
        }
      }
    })

    // Create prereq for CS 220
    await prisma.course.update({
      data: {
        id: "CS220",
        prerequisitesId: expMap.get("CS112").id,
      },
      where: { id: "CS220" },
    });

    // Create the prereq for CS 221
    await prisma.course.update({
      data: {
        id: "CS221",
        prerequisitesId: expMap.get("CS112").id,
      },
      where: { id: "CS221" },
    });

    // Create the OR for CS 220 + CS 221
    await prisma.expression.create({
      data: {
        type: "OR",
        children: {
          connect: [
            { id: expMap.get("CS220").id },
            { id: expMap.get("CS221").id }
          ],
        }
      }
    });

    // create AND for 221 + 245
    const andExp2 = await prisma.expression.create({
      data: {
        type: "AND",
        children: {
          connect: [
            { id: expMap.get("CS221").id },
            { id: expMap.get("CS245").id } 
          ],
        }
      }
    });

    // Now for systems

    // Create the prereq for CS 315
    await prisma.course.update({
      data: {
        id: "CS315",
        prerequisitesId: andExp2.id,
      },
      where: { id: "CS315" },
    });

    // create the co-req for CS 315L
    await prisma.expression.create({
      data: {
        type: "AND",
        children: {
          connect: [
            { id: expMap.get("CS315").id },
            { id: expMap.get("CS315L").id }
          ],
        }
      }
    });


    // NEED TO DO THE REST *stopped before 325**
    return courses;

  } catch (error) {
    console.error("Error creating test data:", error)
  }
}

export async function test1() {
  try {
    // 1. Ensure the referenced courses exist
    const resp = await prisma.course.createMany({
      data: [
        {
          id: "CS245",
          title: "Intro to Programming",
          subjectCode: "CS"
        },
        {
          id: "CS315",
          title: "Data Structures",
          subjectCode: "CS"
        },
        {
          id: "CS326",
          title: "Algorithms",
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
        course: { connect: { id: "CS315" } }
      }
    })

    // 3. Create COURSE expression for 326
    const courseExpr326 = await prisma.expression.create({
      data: {
        type: "COURSE",
        course: { connect: { id: "CS326" } }
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
        course: { connect: { id: "CS245" } }
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
        id: "CS490",
        title: "Senior Team",
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

export async function recursiveQuery() {
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

  const resp = await prisma.expression.findMany({
    include: recursiveInclude()
  })

  console.log("Response: ", JSON.stringify(resp, null, 2))
  return resp
}
