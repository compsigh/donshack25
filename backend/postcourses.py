import httpx
import asyncio
import json
from typing import Generator, Dict, Any

API_URL_BASE = "https://donshack25.vercel.app/api"


def load_courses() -> list[dict]:
    with open("prereqsmade.json", "r") as file:
        return json.load(file)


def generate_course_payloads() -> Generator[Dict[str, Any], None, None]:
    for course in load_courses():
        yield {
            "id": f"{course['subjectCode']}{course['courseDisplay']}",
            "title": f"{course['courseTitle']}",
            "subjectCode": course["subjectCode"],
            "prerequisites": process_prerequisites(course.get("getPrerequisites", [])),
        }


def process_prerequisites(prereqs: list) -> dict:
    if not prereqs:
        return None

    current = None
    for idx, prereq in enumerate(prereqs):
        if idx == 0:
            current = create_expression(prereq)
        else:
            new_expr = create_expression(prereq)
            current = {
                "type": prereq["and_or"].upper() if prereq["and_or"] else "AND",
                "children": [current, new_expr],
            }
    return current


def create_expression(prereq: dict) -> dict:
    return {
        "type": "COURSE",
        "course": {
            "subjectCode": prereq["subject"],
            "courseNumber": f"{prereq['course_number']}",
        },
    }


async def send_db_data(url: str, generator_func):
    async with httpx.AsyncClient() as client:
        for payload in generator_func():
            try:
                res = await client.post(
                    url, headers={"Content-Type": "application/json"}, json=payload
                )
                print(f"Sent to {url}: {res.status_code}")
                res.raise_for_status()
            except httpx.RequestError as e:
                print(f"Failed to send to {url}: {e}")


async def to_db():
    tasks = [
        asyncio.create_task(
            send_db_data(f"{API_URL_BASE}/courses", generate_course_payloads)
        )
    ]
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(to_db())
