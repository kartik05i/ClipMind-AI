from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.transcript import Transcript

router = APIRouter(
    prefix="/transcripts",
    tags=["Transcripts"]
)


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