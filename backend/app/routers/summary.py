from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.summary import Summary
from app.models.transcript import Transcript

from app.services.summary_service import (
    generate_summary,
    save_summary,
)

router = APIRouter(
    prefix="/summaries",
    tags=["Summaries"]
)


@router.post("/generate/{video_id}")
def generate_video_summary(
    video_id: int,
    db: Session = Depends(get_db)
):
    # Check if transcript exists
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

    # Prevent duplicate summaries
    existing = (
        db.query(Summary)
        .filter(Summary.video_id == video_id)
        .first()
    )

    if existing:
        return {
            "message": "Summary already exists",
            "summary": existing.summary
        }

    # Generate summary
    summary_text = generate_summary(
        transcript.transcript
    )

    # Save summary
    save_summary(
        db=db,
        video_id=video_id,
        summary_text=summary_text
    )

    return {
        "message": "Summary generated successfully",
        "summary": summary_text
    }


@router.get("/{video_id}")
def get_summary(
    video_id: int,
    db: Session = Depends(get_db)
):
    summary = (
        db.query(Summary)
        .filter(Summary.video_id == video_id)
        .first()
    )

    if summary is None:
        raise HTTPException(
            status_code=404,
            detail="Summary not found"
        )

    return {
        "video_id": summary.video_id,
        "summary": summary.summary,
        "created_at": summary.created_at
    }