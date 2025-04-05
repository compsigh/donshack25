def subject_generator():
    subjects = [
        {"name": "TEST - Computer Science", "code": "TEST101"},
        {"name": "TEST - Mathematics", "code": "TEST102"},
        {"name": "TEST - Physics", "code": "TEST103"},
        {"name": "TEST - Literature", "code": "TEST104"},
        {"name": "TEST - Biology", "code": "TEST105"},
    ]
    for subject in subjects:
        yield subject

def professor_generator():
    yield 1

def course_generator():
    courses = [
        {
            "name": "TEST - Introduction to Programming",
            "description": "Test course covering basic programming concepts.",
            "credits": 3,
            "subjectId": 1,
            "professorId": 1,
            "prerequisiteIds": [],
            "prerequisiteForIds": []
        },
        {
            "name": "TEST - Data Structures",
            "description": "Test course on arrays, linked lists, trees, and more.",
            "credits": 4,
            "subjectId": 1,
            "professorId": 1,
            "prerequisiteIds": [],
            "prerequisiteForIds": []
        },
        {
            "name": "TEST - Algorithms",
            "description": "Test course focused on algorithm design and analysis.",
            "credits": 3,
            "subjectId": 1,
            "professorId": 1,
            "prerequisiteIds": [],
            "prerequisiteForIds": []
        }
    ]
    for course in courses:
        yield course
