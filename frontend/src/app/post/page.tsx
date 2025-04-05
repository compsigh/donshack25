"use client";

import { useState } from "react";
import { Course, Professor, Subject } from "../../../generated/prisma";
import { postCourse } from "@/functions/db/mutations";

export default function PostPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    credits: 0,
    subjectId: 0,
    professorId: 0,
    prerequisiteIds: [] as number[]
  });

  // Dropdown data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newCourse = await postCourse(
        formData.name,
        formData.description,
        formData.credits,
        formData.subjectId,
        formData.professorId,
        formData.prerequisiteIds
      );
      
      setCourses(prev => [...prev, newCourse]);
      // Reset form
      setFormData({
        name: "",
        description: "",
        credits: 0,
        subjectId: 0,
        professorId: 0,
        prerequisiteIds: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "credits" ? parseInt(value) : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Course Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Credits</label>
          <input
            type="number"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block mb-2">Subject</label>
          <select
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Professor</label>
          <select
            name="professorId"
            value={formData.professorId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a professor</option>
            {professors.map(professor => (
              <option key={professor.id} value={professor.id}>
                {`${professor.firstName} ${professor.lastName}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Prerequisites</label>
          <select
            multiple
            name="prerequisiteIds"
            value={formData.prerequisiteIds as any}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
              setFormData(prev => ({ ...prev, prerequisiteIds: values }));
            }}
            className="w-full p-2 border rounded"
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}
