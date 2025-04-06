import httpx
import asyncio
from getsubjects import get_subject_dict

API_URL_BASE = "https://donshack25.vercel.app/api"

async def send_db_data(url, payload):
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(url, headers={"Content-Type": "application/json"}, json=payload)
            print(f"Sent to {url}: {res.status_code}")
            res.raise_for_status()
        except httpx.RequestError as e:
            print(f"Failed to send to {url}: {e}")

async def seed_subjects():
    subjects = get_subject_dict()
    for name, code in subjects.items():
        payload = {"code": code, "name": name}
        await send_db_data(f"{API_URL_BASE}/subjects", payload)

if __name__ == "__main__":
    asyncio.run(seed_subjects())
