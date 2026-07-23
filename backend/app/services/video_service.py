import os
import shutil

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.video import Video
from app.services.ffmpeg_service import extract_audio
from app.services.whisper_service import generate_transcript
from app.services.transcript_service import save_transcript
from app.services.summary_service import (
    generate_summary,
    save_summary,
)

UPLOAD_DIR = "uploads"


def save_video(
    db: Session,
    file: UploadFile,
    title: str,
    user_id: int,
):
    """
    Save uploaded video, generate transcript and summary.
    """

    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded video
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Get file size
    file_size = os.path.getsize(file_path)

    # Save video record
    video = Video(
        title=title,
        filename=file.filename,
        filepath=file_path,
        file_size=file_size,
        status="Uploaded",
        uploaded_by=user_id,
    )

    db.add(video)
    db.commit()
    db.refresh(video)

    try:
        # -----------------------------
        # Step 1: Extract Audio
        # -----------------------------
        audio_path = extract_audio(file_path)

        video.status = "Audio Extracted"
        db.commit()

        # -----------------------------
        # Step 2: Generate Transcript
        # -----------------------------
        transcript = generate_transcript(audio_path)

        save_transcript(
            db=db,
            video_id=video.id,
            transcript_text=transcript,
        )

        video.status = "Transcript Generated"
        db.commit()

        # -----------------------------
        # Step 3: Generate Summary
        # -----------------------------
        summary = generate_summary(transcript)

        save_summary(
            db=db,
            video_id=video.id,
            summary_text=summary,
        )

        video.status = "Summary Generated"
        db.commit()

    except Exception as e:
        video.status = f"Failed: {str(e)}"
        db.commit()
        raise e

    return video