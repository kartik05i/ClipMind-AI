from fastapi import FastAPI

from app.database.database import engine
from app.database.base import Base

from app.routers.auth import router as auth_router
from app.routers.video import router as video_router
from app.routers.transcript import router as transcript_router
from app.routers.summary import router as summary_router

# Create all database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="ClipMind AI API",
    description="Backend API for ClipMind AI",
    version="1.0.0"
)

# Register routers
app.include_router(auth_router)
app.include_router(video_router)
app.include_router(transcript_router)
app.include_router(summary_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to ClipMind AI"
    }