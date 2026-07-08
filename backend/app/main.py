from fastapi import FastAPI

from app.database.database import engine
from app.database.base import Base

from app.routers.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClipMind AI API",
    description="Backend API for ClipMind AI",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
def home():

    return {
        "message": "Welcome to ClipMind AI "
    }