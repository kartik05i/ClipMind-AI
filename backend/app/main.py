from fastapi import FastAPI

app = FastAPI(
    title="ClipMind AI API",
    version="1.0.0",
    description="Backend API for ClipMind AI"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to ClipMind AI 🚀"
    }