"use client";

import { Professor, Subject } from "@prisma/client";
import { Dropdown } from "./dropdown";

interface CourseFilterProps {
  subjects: Subject[];
  professors: Professor[];
  selectedSubjects: Subject[];
  selectedProfessors: Professor[];
  setSelectedSubjects: (subjects: Subject[]) => void;
  setSelectedProfessors: (professors: Professor[]) => void;
}

export default function CourseFilters(props: CourseFilterProps) {
  const {
    subjects,
    professors,
    selectedSubjects,
    selectedProfessors,
    setSelectedSubjects,
    setSelectedProfessors,
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
    </div>
  );
}
