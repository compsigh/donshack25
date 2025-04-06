import httpx
import asyncio

from getsubjects import subject_generator
from test import course_generator

API_URL_BASE = "https://donshack25.vercel.app/api"

generator1 = ("subjects", subject_generator)

#generators2 = ("courses", course_generator)


async def send_db_data(url, generator_func):
    async with httpx.AsyncClient() as client:
        for payload in generator_func():
            try:
                res = await client.post(url, headers={"Content-Type": "application/json"}, json=payload)
                print(f"Sent to {url}: {res.json()}")
                res.raise_for_status()
            except httpx.RequestError as e:
                print(f"Failed to send to {url}: {e}")

async def to_db():
    task1 = asyncio.create_task(
            send_db_data(f"{API_URL_BASE}/subjects", subject_generator)
        )
    await asyncio.gather(task1)

    task2 = asyncio.create_task(
            send_db_data(f"{API_URL_BASE}/courses", course_generator)
        )
    await asyncio.gather(task2)

if __name__ == "__main__":
    asyncio.run(to_db())
