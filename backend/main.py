import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from test import *

# fastapi dev
# fastapi run
app = FastAPI(docs_url=None, redoc_url=None)

API_URL_BASE = "https://donshack25.vercel.app/api"
HEADERS = {"Content-Type": "application/json"}

generators = [
    ("subjects", subject_generator),
    ("professors", professor_generator),
    ("courses", course_generator),
]

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

async def send_db_data(url, generator_func):
    async with httpx.AsyncClient() as client:
        for payload in generator_func():
            try:
                res = await client.post(url, headers=HEADERS, json=payload)
                print(f"Sent to {url}: {res.status_code}")
                res.raise_for_status()
            except httpx.RequestError as e:
                print(f"Failed to send to {url}: {e}")

@app.get("/seed")
async def to_db():
    tasks = [
        asyncio.create_task(
            send_db_data(f"{API_URL_BASE}/{endpoint}", gen_func)
        )
        for endpoint, gen_func in generators
    ]
    await asyncio.gather(*tasks)
    await asyncio.gather(*tasks)
    return {"status": "done and dusted"}
