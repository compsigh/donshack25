"use client";

import { useEffect, useState } from "react";
import { Dropdown } from "./dropdown";

interface CourseFilterProps {
  subjects: string[];
  professors: string[];
  selectedSubjects: string[];
  selectedProfessors: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  setSelectedProfessors: (professors: string[]) => void;
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
        options={subjects.map((subject, index) => ({
          value: index.toString(),
          label: subject,
        }))}
        placeholder="Select subjects..."
        searchPlaceholder="Search subjects..."
        emptyMessage="No subjects found"
        value={selectedSubjects}
        setValue={setSelectedSubjects}
        onChange={setSelectedSubjects}
      />

      <Dropdown
        options={professors.map((prof, index) => ({
          value: index.toString(),
          label: prof,
        }))}
        placeholder="Select professors..."
        searchPlaceholder="Search professors..."
        emptyMessage="No professors found"
        value={selectedProfessors}
        setValue={setSelectedProfessors}
        onChange={setSelectedProfessors}
      />
    </div>
  );
}
