"use server";

import prisma from ".";

export async function seedLocalDB() {
  try {
    const subject = await prisma.subject.create({
      data: {
        name: "Computer Science",
        code: "CS",
      },
    });

    const math = await prisma.subject.create({
        data: {
            name: "Mathematics",
            code: "MATH",
        }
    });

    const phil = await prisma.professor.create({
      data: {
        name: "Phil Peterson",
        email: "ppeterson@usfca.edu",
      },
    });

    const sophie = await prisma.professor.create({
      data: {
        name: "Sophie Engle",
        email: "sengle@usfca.edu",
      },
    });

    const david = await prisma.professor.create({
      data: {
        name: "David Wolber",
        email: "dwolber@usfca.edu",
      },
    });

    const paul = await prisma.professor.create({
      data: {
        name: "Paul Haskell",
        email: "phaskell@usfca.edu",
      },
    });

    const beste = await prisma.professor.create({
      data: {
        name: "Beste Yuksel",
        email: "byuksel@usfca.edu",
      },
    });

    const olga = await prisma.professor.create({
      data: {
        name: "Olga Karpenko",
        email: "okarpenko@usfca.edu",
      },
    });

    const benson = await prisma.professor.create({
      data: {
        name: "Greg Benson",
        email: "gbenson@usfca.edu",
      },
    });

    const jags = await prisma.professor.create({
        data: {
            name: "Jagadeesan Krishnamurthy",
            email: "jkrishnamurthy@usfca.edu",
        },
    });

    const roven = await prisma.professor.create({
        data: {
            name: "Samuel Roven",
            email: "sroven@usfca.edu"
        }
    });

    const daniel = await prisma.professor.create({
        data: {
            name: "Daniel Jerison",
            email: "djerison@usfca.edu"
        }
    });

    const olivia = await prisma.professor.create({
        data: {
            name: "Olivia Mah",
            email: "omah@usfca.edu",
        }
    });

    const resp = await prisma.course.createMany({
      data: [
        // Lower Division Courses
        {
          name: "Intro to Computer Science I",
          subjectId: subject.id,
          description: "Introduction to Programming and Computer Science",
          professorId: beste.id,
          credits: 4,
        },
        {
          name: "Intro to Computer Science II",
          subjectId: subject.id,
          description:
            "Design and development of significantly sized software using top-down design and bottom-up implementation. Dynamically allocated data, object-oriented programming, architecture of memory, basics of language translation, and basics of algorithm analysis. Development of simple graphical user interfaces. Four hours lecture. Offered Fall and Spring.",
          professorId: paul.id,
          credits: 4,
        },
        {
          name: "Software Development",
          professorId: sophie.id,
          subjectId: subject.id,
          description:
            "Advanced programming topics including inheritance and polymorphism, multi-threaded programming, networking, database programming, and web development. Techniques for debugging, refactoring, and reviewing code.",
          credits: 4,
        },
        {
          name: "C and Systems Programming",
          subjectId: subject.id,
          description:
            "Introduction to the C programming language and UNIX/Linux systems programming. Pointers in C, libraries, devices, processes, threads, system calls, memory management, and interprocess communication with sockets.",
          professorId: phil.id,
          credits: 4,
        },
        {
          name: "Data Struct & Algorithms",
          subjectId: subject.id,
          description:
            "Algorithm analysis and asymptotic running time calculations. Algorithm design techniques and implementation details. Algorithms for sorting and searching, trees, graphs, and other selected topics. Four hours lecture. Offered every Spring.",
          professorId: olga.id,
          credits: 4,
        },

        // Upper Division Courses - Systems Area
        {
          name: "Computer Architecture",
          subjectId: subject.id,
          professorId: phil.id,
          description:
            "Performance analysis techniques, instruction set design, computer arithmetic, digital design, processor implementation, and memory systems. Performance enhancement using pipelining and cache memory. Four hours lecture and two hours lab.",
          credits: 4,
        },
        {
          name: "Operating Systems",
          subjectId: subject.id,
          professorId: benson.id,
          description:
            "The design and implementation of operating systems. Study of processes, threads, scheduling, synchronization, interprocess communication, device drivers, memory management, and file systems. Four hours lecture and two hour lab. Offered every Fall.",
          credits: 4,
        },
        {
          name: "Senior Team Project",
          subjectId: subject.id,
          professorId: jags.id,
          description: "Prerequisite: CS 212 (grade of C or better) and senior standing. Students working in teams investigate, specify, design, implement, test, document, and present to their classmates a significant software project. Sound software engineering practices are presented in lectures and used to evaluate each stage of the project. Written and verbal communication is emphasized through frequent documentation submissions, informal group discussions, code walk-throughs, and student presentations. With the instructor’s permission, the course may be repeated for credit. Four hours lecture. Offered Fall and Spring.",
          credits: 4,
        },
        {
          name: "Calculus & Analytic Geometry I",
          subjectId: math.id,
          professorId: daniel.id,
          description: "Differentiation of algebraic, exponential, logarithmic, trigonometric, and inverse trigonometric functions; implicit differentiation; curve sketching; indeterminate forms; velocity and acceleration; optimization; other applications of differentiation; Fundamental Theorem of Calculus, with applications to area and volume. Four hours lecture. Offered every semester.",
          credits: 4,
        },
        {
          name: "Discrete Mathematics",
          subjectId: math.id,
          professorId: olivia.id,
          description: "Topics include algebraic structures, graph theory, combinatorics, and symbolic logic. Offered every Fall.",
        credits: 4,
        },
        {
          name: "Linear Algebra & Proabability",
          subjectId: math.id,
          professorId: roven.id,
          description: "Matrix arithmetic and matrix algebra (determinants, adding and multiplying matrices, matrix inverse, using matrices to solve systems of equations), geometric applications of linear algebra (matrices as transformations, vectors in 2- and 3-dimensions, equations of planes, etc.); discrete probability, random variables, discrete and continuous probability distributions (including binomial and normal), expected value and variance. Offered every Spring.",
          credits: 4,
        },
      ],
      skipDuplicates: true,
    });

    const courses = await prisma.course.findMany();

    const setPrereq = async (courseName: string, prereqName: string) => {
        await prisma.course.update({
            data: {
                prerequisite: { connect: { id: courses.filter((course) => course.name === prereqName)[0].id } },
            },
            where: { id: courses.filter((course) => course.name === courseName)[0].id }, 
        })
    }


    setPrereq("Discrete Mathematics", "Calculus & Analytic Geometry I");
    setPrereq("Linear Algebra & Proabability", "Discrete Mathematics");
    setPrereq("Discrete Mathematics", "Intro to Computer Science II");
    setPrereq("Data Struct & Algorithms", "Intro to Computer Science II");
    setPrereq("Software Development", "Data Struct & Algorithms");
    setPrereq("C and Systems Programming", "Intro to Computer Science II");
    setPrereq("C and Systems Programming", "Discrete Mathematics");
    setPrereq("Computer Architecture", "C and Systems Programming");
    setPrereq("Computer Architecture", "Data Struct & Algorithms");
    setPrereq("Operating Systems", "C and Systems Programming");
    setPrereq("Operating Systems", "Data Struct & Algorithms");
    setPrereq("Senior Team Project", "Software Development");

    const updatedCourses = await prisma.course.findMany();
    return updatedCourses;
  } catch (error) {
    console.error("Error creating test data:", error);
  }
}