import ijson

from models import *

def parse_courses(filepath="all_course_data.json"):
    with open(filepath, "r") as f:
        courses = ijson.items(f, "item")
        for course in courses:
            course_name = course.get("courseTitle", "default name") or "default name"
            course_code = course.get("subjectCourse", "default code") or "default code"
            description = course.get("subjectDescription", "default description") or "default description"

            credit_low = course.get("creditHourLow", 0) or 0
            credit_high = course.get("creditHourHigh", 0) or 0
            credit = max(credit_low, credit_high)

            subject_id = course.get("id", 0) or 0

            faculty = course.get("faculty") or [
                {
                    "displayName": "default faculty",
                    "emailAddress": "default faculty email",
                }
            ]

            profs = []
            for faculty_info in faculty:
                prof_name = faculty_info.get("displayName", "default faculty")
                prof_email = faculty_info.get("emailAddress", "default faculty email")

                profs.append(
                    Professor(prof_name, prof_email)
                )




                yield {
                    "subject": Subject(course_name, course_code),
                    "professor": Professor(prof_name, prof_email),
                    "raw_course": {
                        "name": course_name,
                        "description": description,
                        "credits": credit,
                        "subjectId": subject_id,
                        "prerequisiteIds": [],         # fill these later if needed
                        "prerequisiteForIds": [],      # ^
                    }
                }
