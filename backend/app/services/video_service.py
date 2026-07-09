import os
import shutil

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.video import Video


UPLOAD_FOLDER = "uploads"


def save_video(
    db: Session,
    file: UploadFile,
    title: str,
    user_id: int
):
    # Create uploads folder if it doesn't exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # File path
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # File size
    file_size = os.path.getsize(file_path)

    # Create database record
    new_video = Video(
        title=title,
        filename=file.filename,
        filepath=file_path,
        file_size=file_size,
        uploaded_by=user_id,
        status="Uploaded"
    )

    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return new_video