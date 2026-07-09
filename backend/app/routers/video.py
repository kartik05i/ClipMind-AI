from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.video_service import save_video
from app.core.dependencies import get_current_user
from app.models.user import User

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