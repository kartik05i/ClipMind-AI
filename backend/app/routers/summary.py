from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.summary import Summary

router = APIRouter(
    prefix="/summaries",
    tags=["Summaries"]
)


@router.get("/{video_id}")
def get_summary(video_id: int, db: Session = Depends(get_db)):
    """
    Get AI-generated summary for a video.
    """

    summary = (
        db.query(Summary)
        .filter(Summary.video_id == video_id)
        .first()
    )

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Summary not found"
        )

    return {
        "video_id": summary.video_id,
        "summary": summary.summary,
        "created_at": summary.created_at
    }