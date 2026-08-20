from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import text

from app.database.database import get_db
from app.models.video import Video


router = APIRouter(
    prefix="/system-analytics",
    tags=["System Analytics"]
)


@router.get("/")
def get_system_analytics(
    db: Session = Depends(get_db)
):

    # ================= STORAGE OVERVIEW =================

    total_videos = db.query(
        func.count(Video.id)
    ).scalar() or 0


    total_storage = db.query(
        func.coalesce(
            func.sum(Video.file_size),
            0
        )
    ).scalar() or 0


    average_video_size = db.query(
        func.coalesce(
            func.avg(Video.file_size),
            0
        )
    ).scalar() or 0


    largest_video_size = db.query(
        func.coalesce(
            func.max(Video.file_size),
            0
        )
    ).scalar() or 0


    # ================= DATABASE STATUS =================

    database_status = "Operational"

    try:
        db.execute(text("SELECT 1"))

    except Exception:
        database_status = "Unavailable"


    # ================= LARGEST VIDEOS =================

    largest_videos = (
        db.query(Video)
        .order_by(Video.file_size.desc())
        .limit(5)
        .all()
    )


    videos_data = []

    for video in largest_videos:

        videos_data.append({
            "id": video.id,
            "title": video.title,
            "file_size": video.file_size,
            "uploaded_at": video.uploaded_at,
            "uploaded_by": (
                video.user.name
                if video.user
                else "Unknown"
            )
        })


    return {
        "system_status": {
            "backend": "Operational",
            "database": database_status,
            "ai_service": "Operational",
            "storage": "Operational"
        },

        "storage_overview": {
            "total_storage": total_storage,
            "total_videos": total_videos,
            "average_video_size": round(
                float(average_video_size),
                2
            ),
            "largest_video_size": largest_video_size
        },

        "largest_videos": videos_data
    }