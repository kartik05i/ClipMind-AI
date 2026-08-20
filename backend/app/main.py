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

from app.routers.learning_history import router as learning_history_router

from app.models.learning_history import LearningHistory

from app.models.bookmark import Bookmark

from app.routers.bookmark import router as bookmark_router

from app.routers.learning_materials import (
    router as learning_materials_router
)

from app.routers.classroom_analytics import (
    router as classroom_analytics_router
)

from app.routers.content_analytics import (
    router as content_analytics_router
)

from app.routers.admin import router as admin_router

from app.models.platform_settings import PlatformSettings

from app.routers.platform_settings import (
    router as platform_settings_router
)

from app.routers.system_analytics import (
    router as system_analytics_router
)

from app.models.audit_log import AuditLog

from app.routers.audit_logs import (
    router as audit_logs_router
)

from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClipMind AI API",
    description="Backend API for ClipMind AI",
    version="1.0.0"
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
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
app.include_router(learning_history_router)
app.include_router(bookmark_router)
app.include_router(learning_materials_router)
app.include_router(classroom_analytics_router)
app.include_router(content_analytics_router)
app.include_router(admin_router)
app.include_router(platform_settings_router)
app.include_router(system_analytics_router)
app.include_router(audit_logs_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to ClipMind AI"
    }