from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.video import Video
from app.models.transcript import Transcript
from app.models.user import User

from app.services.ffmpeg_service import extract_audio
from app.services.whisper_service import generate_transcript
from app.services.transcript_service import save_transcript

from app.core.dependencies import (
    get_current_user,
    require_role
)

from app.core.roles import (
    EDUCATOR,
    CONTENT_CREATOR,
    ADMINISTRATOR,
)

router = APIRouter(
    prefix="/transcripts",
    tags=["Transcripts"]
)


@router.post("/generate/{video_id}")
def generate_video_transcript(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role([
            EDUCATOR,
            CONTENT_CREATOR,
            ADMINISTRATOR,
        ])
    )
):

    # Check if video exists
    video = (
        db.query(Video)
        .filter(Video.id == video_id)
        .first()
    )

    if video is None:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    # Check if transcript already exists
    existing = (
        db.query(Transcript)
        .filter(Transcript.video_id == video_id)
        .first()
    )

    if existing:
        return {
            "message": "Transcript already exists",
            "transcript": existing.transcript
        }

    # Extract audio
    audio_path = extract_audio(video.filepath)

    # Generate transcript + timestamps
    transcript_text, timestamp_data = generate_transcript(audio_path)

    # Print timestamps in terminal (temporary)
    print("\n========== TIMESTAMPS ==========")
    for segment in timestamp_data:
        print(segment)
    print("================================\n")

    # Save transcript
    save_transcript(
        db=db,
        video_id=video.id,
        transcript_text=transcript_text
    )

    return {
        "message": "Transcript generated successfully",
        "transcript": transcript_text,
        "timestamps": timestamp_data
    }


@router.get("/{video_id}")
def get_transcript(
    video_id: int,
    db: Session = Depends(get_db)
):

    transcript = (
        db.query(Transcript)
        .filter(Transcript.video_id == video_id)
        .first()
    )

    if transcript is None:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    return {
        "video_id": video_id,
        "transcript": transcript.transcript
    }