"use client";

import { Subject, Course } from "@prisma/client";
import { Dropdown } from "./dropdown";

interface CourseFilterProps {
  subjects: Subject[];
  courses: Course[];
  coursesTaken: Course[];
  selectedSubjects: Subject[];
  setSelectedSubjects: (subjects: Subject[]) => void;
  setCoursesTaken: (courses: Course[]) => void;
}

export default function CourseFilters(props: CourseFilterProps) {
  const {
    subjects,
    courses,
    coursesTaken,
    selectedSubjects,
    setSelectedSubjects,
    setCoursesTaken,
  } = props;

  return (
    <div className="flex flex-col gap-4 p-4">
      <Dropdown
        options={subjects}
        selectedOptions={selectedSubjects}
        setSelectedOptions={setSelectedSubjects}
        placeholder="Select subjects..."
        searchPlaceholder="Search subjects..."
        emptyMessage="No subjects found"
        type="subject"
      />
      <Dropdown
        options={courses}
        selectedOptions={coursesTaken}
        setSelectedOptions={setCoursesTaken}
        placeholder="Courses taken..."
        searchPlaceholder="Search courses..."
        emptyMessage="No courses found"
        type="course"
      />
    </div>
  );
}
