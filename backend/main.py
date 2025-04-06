import httpx
import asyncio

from test import *

API_URL_BASE = "https://donshack25.vercel.app/api"

generators1 = [
    ("subjects", subject_generator),
    ("professors", professor_generator),
]

generators2 = [
    ("courses", course_generator),
]

async def send_db_data(url, generator_func):
    async with httpx.AsyncClient() as client:
        for payload in generator_func():
            try:
                res = await client.post(url, headers={"Content-Type": "application/json"}, json=payload)
                print(f"Sent to {url}: {res.status_code}")
                res.raise_for_status()
            except httpx.RequestError as e:
                print(f"Failed to send to {url}: {e}")

async def to_db():
    task1 = [
        asyncio.create_task(
            send_db_data(f"{API_URL_BASE}/{endpoint}", gen_func)
        )
        for endpoint, gen_func in generators1
    ]
    await asyncio.gather(*task1)

    task2 = [
        asyncio.create_task(
            send_db_data(f"{API_URL_BASE}/{endpoint}", gen_func)
        )
        for endpoint, gen_func in generators2
    ]
    await asyncio.gather(*task2)

if __name__ == "__main__":
    asyncio.run(to_db())
