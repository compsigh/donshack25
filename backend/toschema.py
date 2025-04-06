import json
import sys
from pathlib import Path


def transform_courses(input_data):
    return [
        {
            "subjectCode": course["subjectCode"],
            "courseDisplay": course["courseDisplay"],
            "courseTitle": course["courseTitle"],
            "getPrerequisites": course["getPrerequisites"],
        }
        for course in input_data
    ]


def validate_input_file(input_path):
    if not input_path.exists():
        print(f"Error: Input file {input_path} not found")
        sys.exit(1)
    if input_path.suffix.lower() != ".json":
        print("Error: Input file must be a JSON file (.json)")
        sys.exit(1)


def main():
    # Configure paths
    input_path = Path("detailed_course_data_parsed.json")
    output_path = Path("simplified_courses.json")

    # Validate input file
    validate_input_file(input_path)

    try:
        # Read input JSON
        with input_path.open(encoding="utf-8") as f:
            courses = json.load(f)

        # Transform data
        simplified_courses = transform_courses(courses)

        # Write output JSON
        with output_path.open("w", encoding="utf-8") as f:
            json.dump(simplified_courses, f, indent=2, ensure_ascii=False)

        print(f"Success: {len(simplified_courses)} courses transformed")
        print(f"Output saved to {output_path.resolve()}")

    except json.JSONDecodeError:
        print("Error: Invalid JSON format in input file")
    except KeyError as e:
        print(f"Error: Missing required field - {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")


if __name__ == "__main__":
    main()
