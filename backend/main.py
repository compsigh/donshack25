from fastapi import FastAPI

# fastapi dev
# fastapi run
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/send")
async def to_db():
    # call jet's get_data()
    # send to db
    pass
