from getsubjects import get_subject_dict
import json

def normalize_prerequisites(input_data, subject_dict):

    # Load the JSON data
    data = json.loads(input_data)

    # Process each course
    unresolved_names = set()
    for course in data:
        prerequisites = course.get("getPrerequisites", [])
        for prereq in prerequisites:
            subject_name = prereq.get("subject")
            if subject_name in subject_dict:
                prereq["subject"] = subject_dict[subject_name]
            else:
                unresolved_names.add(subject_name)
                prerequisites.remove(prereq)


    # Print unresolved names
    if unresolved_names:
        print("Unresolved subject names:", unresolved_names)

    # Return the updated JSON data as a string
    return json.dumps(data, indent=4)

# Example usage
if __name__ == "__main__":
    # Load the subject dictionary
    subject_dict = get_subject_dict()

    # Read input file
    with open("simplified_courses.json", 'r') as f:
        input_data = f.read()

    # Normalize prerequisites
    output_data = normalize_prerequisites(input_data, subject_dict)

    # Write output file
    with open("prereqsmade.json", 'w') as f:
        f.write(output_data)

        """❯ uv run normalizeprenames.py
Unresolved subject names: {'English as a Second Language', 'MBA Intensive', 'Tagalog', 'Architecture & Community Desig', 'Visual Arts', 'Analytics', 'Transfer credit', 'Comparative Literature & Cultu', 'Exercise and Sport Science', 'Performing Arts & Social Justi'}"""