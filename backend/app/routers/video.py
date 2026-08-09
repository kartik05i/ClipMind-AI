from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.video_service import save_video
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.video import Video

router = APIRouter(
    prefix="/videos",
    tags=["Videos"]
)


@router.post("/upload")
def upload_video(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    video = save_video(
        db=db,
        file=file,
        title=title,
        user_id=current_user.id
    )

    return {
        "message": "Video uploaded successfully",
        "video_id": video.id,
        "title": video.title,
        "filename": video.filename
    }

@router.get("/")
def get_all_videos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    videos = (
        db.query(Video)
        .filter(Video.uploaded_by == current_user.id)
        .order_by(Video.uploaded_at.desc())
        .all()
    )

    return [
        {
            "video_id": video.id,
            "title": video.title,
            "filename": video.filename,
            "status": video.status,
            "uploaded_at": video.uploaded_at,
        }
        for video in videos
    ]