import json

def process_courses(json_filepath):
    try:
        # Load JSON from file
        with open(json_filepath, 'r') as f:
            courses = json.load(f)
        
        combined_names = []
        seen_combinations = set()
        duplicates_count = 0

        # Process each course entry
        for course in courses:
            # Create combined identifier
            combined = f"{course.get('subjectCode', '')}-{course.get('courseDisplay', '')}"
            
            # Check for duplicates
            if combined in seen_combinations:
                print(f"Duplicate found: {combined}")
                duplicates_count += 1
            else:
                seen_combinations.add(combined)
                combined_names.append(combined)

        # Print results
        print(f"\nUnique combinations: {len(combined_names)}")
        print(f"Original courses: {len(courses)}")
        print(f"Duplicates found: {duplicates_count}")
        print(f"Difference: {len(courses) - len(combined_names)}")

    except FileNotFoundError:
        print(f"Error: File not found at {json_filepath}")
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in file")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

# Example usage
if __name__ == "__main__":

    # validates that code plus number is unique. it is
    process_courses('detailed_course_data_parsed.json')
