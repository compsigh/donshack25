from fastapi import FastAPI

# fastapi dev
# fastapi run
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}