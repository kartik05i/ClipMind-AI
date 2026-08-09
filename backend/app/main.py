from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.base import Base

from app.routers.auth import router as auth_router
from app.routers.video import router as video_router
from app.routers.transcript import router as transcript_router
from app.routers.summary import router as summary_router

from app.routers.keymoment import router as keymoment_router

from app.routers.highlight import router as highlight_router

from app.routers.keyword import router as keyword_router

from app.routers.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClipMind AI API",
    description="Backend API for ClipMind AI",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(video_router)
app.include_router(transcript_router)
app.include_router(summary_router)
app.include_router(keymoment_router)
app.include_router(highlight_router)
app.include_router(keyword_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to ClipMind AI"
    }