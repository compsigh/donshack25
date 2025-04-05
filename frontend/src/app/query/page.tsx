import { useEffect, useState } from "react";
import { Course } from "../../../generated/prisma";
import { getAllCourses } from "@/functions/db/queries";

export default function QueryPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses();
      setCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <h1>Query Page</h1>
      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
