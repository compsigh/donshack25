from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

# fastapi dev
# fastapi run
app = FastAPI(docs_url=None, redoc_url=None)

API_URL_BASE = "https://donshack25.vercel.app/api/"
ENDPOINTS = ["subjects", "professors", "courses"]
HEADERS = {"Content-Type": "application/json"}

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

def post_subjects(send_to):
    pass

def post_profs(send_to):
    pass

def post_courses(send_to):
    pass

@app.post("/seed")
async def to_db():
    # call jet's get_data()
    # send to db
    for endpoint in ENDPOINTS:
        send_to = f"{API_URL_BASE}{endpoint}"
        if endpoint == "subjects":
            post_subjects(send_to)
        if endpoint == "professors":
            post_profs(send_to)
        if endpoint == "courses":
            post_courses(send_to)

    pass
