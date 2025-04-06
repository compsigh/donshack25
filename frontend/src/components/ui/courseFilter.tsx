"use client";

import { Professor, Subject, Course } from "@prisma/client";
import { Dropdown } from "./dropdown";

interface CourseFilterProps {
  subjects: Subject[];
  professors: Professor[];
  courses: Course[];
  coursesTaken: Course[];
  selectedSubjects: Subject[];
  selectedProfessors: Professor[];
  setSelectedSubjects: (subjects: Subject[]) => void;
  setSelectedProfessors: (professors: Professor[]) => void;
  setCoursesTaken: (courses: Course[]) => void;
}

export default function CourseFilters(props: CourseFilterProps) {
  const {
    subjects,
    professors,
    courses,
    coursesTaken,
    selectedSubjects,
    selectedProfessors,
    setSelectedSubjects,
    setSelectedProfessors,
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
        options={professors}
        selectedOptions={selectedProfessors}
        setSelectedOptions={setSelectedProfessors}
        placeholder="Select professors..."
        searchPlaceholder="Search professors..."
        emptyMessage="No professors found"
        type="professor"
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
