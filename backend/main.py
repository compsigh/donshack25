from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# fastapi dev
# fastapi run
app = FastAPI(docs_url=None, redoc_url=None)

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

@app.post("/send")
async def to_db():
    # call jet's get_data()
    # send to db
    pass
