from fastapi import FastAPI

from app.database.database import engine
from app.database.base import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClipMind AI API",
    version="1.0.0",
    description="Backend API for ClipMind AI"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to ClipMind AI 🚀"
    }